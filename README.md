This is the Casa Atenta web platform, built with
[Next.js](https://nextjs.org).

La operación de correo usa Cloudflare como DNS autoritativo, Namecheap Private
Email como buzón receptor actual y Resend para salida transaccional. La guía
general está en [`docs/EMAIL_SECURITY_SETUP.md`](docs/EMAIL_SECURITY_SETUP.md) y
el flujo privado de cotizaciones en
[`docs/QUOTATION_EMAIL_SYSTEM.md`](docs/QUOTATION_EMAIL_SYSTEM.md). No se debe
cambiar MX ni activar Cloudflare Email Routing sin una migración aprobada.

Supabase y Resend pertenecen a la infraestructura separada de Casa Atenta. El
acceso MCP exclusivo del repositorio se explica en
[`.codex/README.md`](.codex/README.md); sus tokens OAuth no sustituyen las
variables runtime. Copia `.env.example` solo como referencia y nunca confirmes
secretos, destinatarios internos ni datos de clientes en Git.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

El despliegue debe cargar las variables privadas directamente en Vercel. Antes
de promover cambios de correo a producción, usa un Preview, ejecuta el modo de
prueba y verifica los IDs individuales de Resend y la auditoría en Supabase.
Los envíos de cotizaciones reales permanecen bloqueados salvo que la bandera
server-side se habilite expresamente y se completen las dos confirmaciones
humanas descritas en la guía del sistema.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
