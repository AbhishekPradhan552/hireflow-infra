"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentSubscription,
  getUsage,
  upgradePlan,
  cancelSubscription,
} from "@/lib/api/billing.api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BillingPage() {
  const queryClient = useQueryClient();

  // 🔥 Queries
  const { data: sub, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: getCurrentSubscription,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: getUsage,
  });

  // 🔥 Mutations
  const upgradeMutation = useMutation({
    mutationFn: upgradePlan,
    onSuccess: (_, plan) => {
      toast.success(`You're now on ${plan}`);
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (err) => {
      toast.error(err.message || "Upgrade failed");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success("Switched to FREE plan");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: () => {
      toast.error("Failed to downgrade");
    },
  });

  if (subLoading || usageLoading) {
    return <div className="p-6">Loading billing…</div>;
  }

  // ✅ IMPROVED LOGIC
  const getAction = (targetPlan) => {
    const current = sub?.plan;

    // Same plan
    if (current === targetPlan) return "current";

    // FREE → can upgrade to anything
    if (current === "FREE") return "upgrade";

    // PRO logic
    if (current === "PRO") {
      if (targetPlan === "FREE") return "downgrade-free";
      if (targetPlan === "TEAM") return "upgrade";
      return "current";
    }

    // TEAM logic
    if (current === "TEAM") {
      if (targetPlan === "FREE") return "downgrade-free";
      if (targetPlan === "PRO") return "downgrade-pro"; // 👈 important fix
      return "current";
    }

    return "upgrade";
  };

  const plans = [
    {
      name: "FREE",
      price: "₹0",
      desc: "Best to explore",
      limit: "50 resumes / month",
    },
    {
      name: "PRO",
      price: "₹499",
      desc: "For serious hiring",
      limit: "500 resumes / month",
    },
    {
      name: "TEAM",
      price: "₹999",
      desc: "Scale your team",
      limit: "Unlimited resumes",
    },
  ];

  return (
  <div className="
    relative
    px-3 sm:px-6 py-4 sm:py-6 space-y-8 max-w-5xl

    bg-gradient-to-b from-white to-zinc-50
    rounded-3xl

    border border-white/40
    shadow-[0_20px_60px_rgba(16,185,129,0.08)]

    backdrop-blur-xl
  ">
    {/* subtle glow */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full pointer-events-none" />

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">

      {/* LEFT */}
      <div className="space-y-1">

        <h1 className="
          text-3xl font-semibold tracking-tight
          text-zinc-900
          
        ">
          Billing
        </h1>

        <p className="text-sm text-zinc-500">
          Manage your plan and usage
        </p>

      </div>

      {/* RIGHT BADGE */}
      <div className="
        flex sm:hidden mt-2 items-center gap-2
        px-3 py-1.5 rounded-full

       bg-emerald-50
       border border-emerald-200
        
      ">
        <span className="text-xs text-zinc-500">Plan:</span>
        <span className="text-xs font-semibold text-emerald-700">
          {sub?.plan}
        </span>
      </div>

    </div>

    {/* CURRENT PLAN + USAGE */}
    <div className="p-4 rounded-2xl
    bg-white/40 backdrop-blur-md

    border border-white/40
    shadow-sm

    grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

      {/* CURRENT PLAN */}
      <Card className="relative overflow-hidden rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-sm border-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />

        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Current Plan
        </p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-3xl font-bold">{sub?.plan}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Active subscription
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 font-medium">
            {sub?.status}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          You are currently on this plan
        </p>
      </Card>

      {/* USAGE */}
      <Card className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-sm border-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />

        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Monthly Usage
        </p>

        <div className="mt-3">
          <p className="text-2xl font-semibold">
            {usage?.resumesParsed} /{" "}
            {usage?.limit === null ? "Unlimited" : usage?.limit}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Resumes parsed this month
          </p>
        </div>

        {usage?.limit !== null && (
          <div className="mt-4 h-2 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${(usage.resumesParsed / usage.limit) * 100}%`,
              }}
            />
          </div>
        )}

        {usage?.limit !== null && (
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(
              (usage.resumesParsed / usage.limit) * 100
            )}% used
          </p>
        )}
      </Card>
    </div>

    {/* PLANS */}
    <div className=" p-4 rounded-2xl
    bg-white/40 backdrop-blur-md

    border border-white/40
    shadow-sm

    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
      {plans.map((plan) => {
        const isPopular = plan.name === "PRO";
        const action = getAction(plan.name);

        return (
          <Card
            key={plan.name}
            className={`rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-lg border-none
            ${
              plan.name === "FREE"
                ? "bg-gradient-to-br from-muted/40 to-muted/10"
                : ""
            }
            ${
              plan.name === "PRO"
                ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent scale-[1.03]"
                : ""
            }
            ${
              plan.name === "TEAM"
                ? "bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent"
                : ""
            }
          `}
          >
            <CardContent className="p-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{plan.name}</p>

                  {isPopular && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500 text-white">
                      MOST POPULAR
                    </span>
                  )}
                </div>

                <p className="text-2xl font-semibold">{plan.price}</p>

                <p className="text-xs text-muted-foreground">
                  {plan.desc}
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-3">
                {plan.limit}
              </p>

              <div className="mt-4 sm:mt-5">
                {action === "current" && (
                  <Button
                    disabled
                    className="w-full rounded-xl opacity-70"
                    variant="secondary"
                  >
                    Current Plan
                  </Button>
                )}

                {action === "upgrade" && (
                  <Button
                    onClick={() => upgradeMutation.mutate(plan.name)}
                    className={`w-full rounded-xl
                    ${
                      plan.name === "PRO"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : ""
                    }
                  `}
                  >
                    Upgrade
                  </Button>
                )}

                {action === "downgrade-pro" && (
                  <Button
                    onClick={() => upgradeMutation.mutate("PRO")}
                    variant="secondary"
                    className="w-full rounded-xl"
                  >
                    Switch to PRO
                  </Button>
                )}

                {action === "downgrade-free" && (
                  <Button
                    onClick={() => cancelMutation.mutate()}
                    variant="secondary"
                    className="w-full rounded-xl"
                  >
                    Switch to Free
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* CANCEL */}
    {sub?.plan !== "FREE" && (
      <Button
        variant="ghost"
        onClick={() => cancelMutation.mutate()}
        className="text-sm w-full sm:w-auto text-muted-foreground hover:text-red-500 text-muted-foreground hover:text-red-500"
      >
        Cancel subscription
      </Button>
    )}
  </div>
);
}