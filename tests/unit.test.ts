import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProject } from "@/components/data/projects";
import { safeReturnTo } from "@/components/lib/authReturnTo";
import { inquirySchema, isHoneypotSubmission } from "@/inquiries";
import { getContactDefaults } from "@/contact";
import { isSuperAdmin } from "@/components/lib/admin";

const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));
vi.mock("@/supabase/admin", () => ({
  createAdminClient: () => ({ from: () => ({ insert: insertMock }) }),
}));

describe("inquiry validation", () => {
  it("accepts a complete inquiry and applies optional defaults", () => {
    const result = inquirySchema.parse({
      full_name: "Ada Lovelace",
      email: "ada@example.com",
      inquiry_type: "General Construction",
      message: "We need a construction estimate for a new facility.",
    });

    expect(result.organization).toBe("");
    expect(result.phone).toBe("");
  });

  it("rejects missing, malformed, and short required values", () => {
    const result = inquirySchema.safeParse({
      full_name: "",
      email: "invalid",
      inquiry_type: "",
      message: "short",
    });

    expect(result.success).toBe(false);
  });

  it("identifies honeypot submissions", () => {
    expect(isHoneypotSubmission({ website: "https://spam.example" })).toBe(true);
    expect(isHoneypotSubmission({ website: "" })).toBe(false);
  });
});

describe("safe return URLs", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { origin: "https://cmtbuilders.example", search: "" },
    });
  });

  it("keeps same-origin paths and strips bootstrap parameters", () => {
    window.location.search = "?returnTo=%2Fcontact%3Faccess_token%3Dbad%26type%3Dquote";
    expect(safeReturnTo()).toBe("/contact?type=quote");
  });

  it("rejects external and protocol-relative redirects", () => {
    window.location.search = "?returnTo=https%3A%2F%2Fevil.example";
    expect(safeReturnTo()).toBe("/");
    window.location.search = "?returnTo=%2F%2Fevil.example";
    expect(safeReturnTo()).toBe("/");
  });
});

describe("project lookup", () => {
  it("returns a project by slug and undefined for an unknown slug", () => {
    expect(getProject("camiguin-airport")?.title).toBe("Camiguin Airport");
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("contact defaults", () => {
  it("parses inquiry type and equipment from the query string", () => {
    expect(getContactDefaults("?type=Equipment%20Rental&equipment=Excavator")).toEqual({
      defaultType: "Equipment Rental",
      defaultMessage: "Equipment inquiry: Excavator\n\n",
    });
  });
});

describe("admin authorization", () => {
  it("only accepts the server-managed super_admin app metadata role", () => {
    expect(isSuperAdmin({ app_metadata: { role: "super_admin" } })).toBe(true);
    expect(isSuperAdmin({ app_metadata: { role: "admin" } })).toBe(false);
    expect(isSuperAdmin(null)).toBe(false);
  });
});

describe("inquiry API contract", () => {
  it("returns a reference after a valid inquiry is persisted", async () => {
    insertMock.mockResolvedValueOnce({ error: null });
    const { POST } = await import("../app/api/inquiries/route");
    const response = await POST(new Request("http://localhost/api/inquiries", {
      method: "POST",
      body: JSON.stringify({
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        inquiry_type: "General Construction",
        message: "We need a construction estimate for a new facility.",
        website: "",
      }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, reference: expect.stringMatching(/^CMT-/) });
  });

  it("returns a validation error for malformed JSON input", async () => {
    const { POST } = await import("../app/api/inquiries/route");
    const response = await POST(new Request("http://localhost/api/inquiries", {
      method: "POST",
      body: JSON.stringify({ email: "bad" }),
      headers: { "Content-Type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).ok).toBe(false);
  });
});
