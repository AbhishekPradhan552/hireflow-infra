import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({ children }) {
  return (
    <main
      className="
        relative min-h-screen flex flex-col
        bg-gradient-to-br from-indigo-50 via-white to-blue-50
        overflow-hidden
        py-6 sm:py-10
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-blue-200/40 blur-[100px] rounded-full" />
      </div>

      {/* TOP BRAND */}
      <div className="w-full px-4 py-5 flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
          HireFlow
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div
          className="
            w-full max-w-6xl xl:max-w-7xl
            grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]
            gap-8 md:gap-14 lg:gap-20
            items-start md:items-center
          "
        >
          {/* LEFT SIDE */}
          <div
            className="
              hidden md:flex flex-col justify-center
              space-y-6 lg:space-y-8
              max-w-xl lg:max-w-2xl
              animate-in fade-in slide-in-from-left-10 duration-700
            "
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-zinc-900">
              Build better teams with <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                AI-powered hiring
              </span>
            </h2>

            <p className="text-zinc-600 max-w-md text-sm sm:text-base leading-relaxed">
              Automatically extract skills, analyze resumes, and surface the best candidates —
              all in seconds.
            </p>

            <div className="space-y-3 mt-6">
              {[
                "AI-powered skill extraction",
                "Smart candidate matching",
                "Instant resume insights",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-700"
                >
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  {item}
                </div>
              ))}
            </div>

            <div
              className="
                mt-6 w-[280px] lg:w-[320px]
                rounded-2xl
                bg-white/60 backdrop-blur-xl
                border border-white/40
                shadow-md p-4
              "
            >
              <p className="text-xs text-zinc-500 mb-2">AI Insight</p>
              <p className="text-sm font-medium text-zinc-800">
                87% match found for Backend Engineer role
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-center relative">
            {/* subtle background panel */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-b from-indigo-100/40 to-blue-100/40
                rounded-[32px]
                blur-2xl
                scale-105
                -z-10
              "
            />

            <Card
              className="
                w-full max-w-sm sm:max-w-md lg:max-w-lg
                rounded-2xl sm:rounded-3xl
                bg-white/80 backdrop-blur-xl
                border border-white/40
                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                sm:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                hover:scale-[1.01] transition-transform duration-300
              "
            >
              <CardContent className="p-5 sm:p-8">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-zinc-500 pb-10 sm:pb-12 mt-6">
        Trusted by modern teams building faster 🚀
      </div>
    </main>
  );
}