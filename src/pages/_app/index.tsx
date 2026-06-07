import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/Button";
import Receipt from "../../assets/receipt-icon.svg";
import Graphic from "../../assets/graphic.svg";
import ShieldCheck from "../../assets/shield-check.svg";

export const Route = createFileRoute("/_app/")({
    component: Index,
    head: () => ({
        meta: [
            {
                title: "Radar de Impostos - Home",
            },
        ],
    }),
});

function Index() {
    return (
        <main className="text-center mt-10 max-w-4xl mx-auto px-4">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#334155] bg-[#0f172b] px-4 py-2 text-xs font-medium text-[#90a1b9]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-50" />
                Transparência sobre seus impostos
            </span>
            <h1 className="text-6xl font-bold mb-6">Radar de Impostos</h1>
            <p className="text-lg text-[#90a1b9] text-balance max-w-2xl mx-auto mb-8">
                Cadastre seus cupons e descubra quanto dos seus gastos são
                impostos. Acompanhe, organize e entenda para onde vai o seu
                dinheiro.
            </p>
            <div className="flex justify-center items-center gap-5">
                <Link to="/auth/register">
                    <Button variant="primary" size="sm">
                        Criar conta Grátis
                    </Button>
                </Link>
                <Link to="/auth/login">
                    <Button variant="secondary" size="md">
                        Entrar
                    </Button>
                </Link>
            </div>
                        <div className="mt-20 grid w-full gap-6 sm:grid-cols-3">
          {[
            {
              icon: Receipt,
              title: "Cadastre cupons",
              desc: "Escaneie o QR Code da NFC-e e salve seu histórico automaticamente.",
            },
            {
              icon: Graphic,
              title: "Veja estatísticas",
              desc: "Saiba quanto pagou em tributos em qualquer período.",
            },
            {
              icon: ShieldCheck,
              title: "Sem dados pessoais",
              desc: "Crie sua conta apenas com um email.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-[#334155] bg-[rgba(15,23,43,0.47)] p-6 text-left transition-colors hover:border-[#b2c3ec]/40"
            >
              <div className="mb-4 flex h-10 w-10 p-1.5 items-center justify-center rounded-lg bg-[#323848]">
                <img src={Icon} alt={`${title} icon`} className="h-10 w-10 invert brightness-0 rounded-md" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-[#90a1b9]">{desc}</p>
            </div>
          ))}
        </div>
        </main>
    );
}
