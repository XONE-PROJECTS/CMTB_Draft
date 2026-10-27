import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";
import { createAdminClient } from "@/supabase/admin";
import { requireSuperAdmin } from "@/components/lib/admin";

export const dynamic = "force-dynamic";

type Inquiry = {
  id: string;
  reference: string;
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  inquiry_type: string;
  project_location: string;
  budget: string;
  timeline: string;
  message: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminPage() {
  const user = await requireSuperAdmin();
  const { data, error } = await createAdminClient()
    .from("inquiries")
    .select("id, reference, full_name, organization, email, phone, inquiry_type, project_location, budget, timeline, message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Admin inquiry lookup failed", error);
  }

  const inquiries = (data ?? []) as Inquiry[];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">CMTBuilders</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Authenticated as super admin</p>
            <h2 className="mt-1 text-3xl font-semibold">Inquiry inbox</h2>
          </div>
          <Link href="/contact" className="text-sm font-semibold text-brand-red hover:underline">
            Open public contact form →
          </Link>
        </div>

        {error ? (
          <div className="border border-red-400/30 bg-red-950/40 p-6 text-red-100">
            We could not load inquiries right now. Check the Supabase connection and try again.
          </div>
        ) : inquiries.length === 0 ? (
          <div className="border border-white/10 bg-white/5 p-8 text-slate-300">No inquiries have been submitted yet.</div>
        ) : (
          <div className="overflow-hidden border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Details</th>
                    <th className="px-5 py-4">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="align-top hover:bg-white/[0.04]">
                      <td className="px-5 py-5 font-mono text-xs text-brand-red">{inquiry.reference}</td>
                      <td className="px-5 py-5">
                        <p className="font-semibold text-white">{inquiry.full_name}</p>
                        {inquiry.organization && <p className="mt-1 text-slate-400">{inquiry.organization}</p>}
                        <a className="mt-2 block text-slate-300 hover:text-brand-red" href={`mailto:${inquiry.email}`}>
                          {inquiry.email}
                        </a>
                        {inquiry.phone && <p className="mt-1 text-slate-400">{inquiry.phone}</p>}
                      </td>
                      <td className="px-5 py-5 text-slate-200">{inquiry.inquiry_type}</td>
                      <td className="max-w-md px-5 py-5 text-slate-300">
                        {inquiry.project_location && <p><span className="text-slate-500">Location:</span> {inquiry.project_location}</p>}
                        {inquiry.budget && <p className="mt-1"><span className="text-slate-500">Budget:</span> {inquiry.budget}</p>}
                        {inquiry.timeline && <p className="mt-1"><span className="text-slate-500">Timeline:</span> {inquiry.timeline}</p>}
                        <p className="mt-3 whitespace-pre-wrap text-white">{inquiry.message}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-5 text-slate-400">{formatDate(inquiry.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
