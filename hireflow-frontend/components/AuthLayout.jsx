export default function AuthLayout({ title, children }) {
    return(
        <section className="min-h-screen flex justify-center pt-24">
            <div className="w-full max-w-sm mx-auto">
                <h1>{title}</h1>
                {children}
            </div>
            
        </section>
    )
}