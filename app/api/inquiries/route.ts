import { NextResponse } from "next/server";
import { createAdminClient } from "@/supabase/admin";
import { createInquiryReference, inquirySchema, isHoneypotSubmission } from "@/inquiries";

export async function POST(request: Request) {
  try {
    const parsed = inquirySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid inquiry." }, { status: 400 });
    }

    if (isHoneypotSubmission(parsed.data)) {
      return NextResponse.json({ ok: true, reference: createInquiryReference() });
    }

    const reference = createInquiryReference();
    const { website: _website, ...inquiry } = parsed.data;
    const { error } = await createAdminClient().from("inquiries").insert({ ...inquiry, reference });

    if (error) {
      console.error("Inquiry insert failed", error);
      return NextResponse.json({ ok: false, error: "We could not submit your inquiry. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, reference });
  } catch (error) {
    console.error("Inquiry request failed", error);
    return NextResponse.json({ ok: false, error: "We could not submit your inquiry. Please try again." }, { status: 500 });
  }
}
