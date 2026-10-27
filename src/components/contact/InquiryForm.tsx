// @ts-nocheck
"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { inquiryTypes } from "@/data/company";

const fieldClass =
  "w-full border border-brand-line bg-white px-3.5 py-3 text-[14px] text-brand-black placeholder:text-brand-muted/80 transition-colors focus:border-brand-black focus:outline-none";

const labelClass =
  "mb-1.5 block font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-gray";

const initialState = {
  full_name: "",
  organization: "",
  email: "",
  phone: "",
  inquiry_type: "",
  project_location: "",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};

export default function InquiryForm({ defaultType = "", defaultMessage = "" }) {
  const [form, setForm] = useState({
    ...initialState,
    inquiry_type: defaultType || initialState.inquiry_type,
    message: defaultMessage || initialState.message,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.full_name.trim()) next.full_name = "Please enter your full name.";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!form.inquiry_type) next.inquiry_type = "Please select an inquiry type.";
    if (!form.message.trim()) next.message = "Please describe your requirement.";
    else if (form.message.trim().length < 10)
      next.message = "Please provide a little more detail about your requirement.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        full_name: form.full_name.trim(),
        organization: form.organization.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        inquiry_type: form.inquiry_type,
        project_location: form.project_location.trim(),
        budget: form.budget.trim(),
        timeline: form.timeline.trim(),
        message: form.message.trim(),
        website: form.website,
        }),
      });
      const data = await response.json();

      if (response.ok && data?.ok) {
        setReference(data.reference || "");
        setStatus("success");
        setForm(initialState);
      } else {
        setServerError(data?.error || "We could not submit your inquiry. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      setServerError(
        error?.response?.data?.error ||
          error?.message ||
          "We could not submit your inquiry. Please try again.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-brand-line border-t-[3px] border-t-brand-red bg-white p-8">
        <CheckCircle2 className="h-8 w-8 text-brand-red" strokeWidth={1.6} aria-hidden="true" />
        <h3 className="mt-4 font-heading text-[20px] font-extrabold uppercase text-brand-black">
          Inquiry received
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-gray">
          Thank you. Your inquiry has been recorded and our team will review the details you
          provided.
          {reference ? (
            <>
              {" "}
              Your reference is{" "}
              <span className="font-heading text-[13px] font-bold text-brand-black">{reference}</span>.
            </>
          ) : null}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-brand-gray">
          For urgent requirements, call{" "}
          <a href="tel:+639176310707" className="font-medium text-brand-red hover:underline">
            +63 917 631 0707
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 border border-brand-black px-5 py-3 font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:bg-brand-black hover:text-white"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-brand-line border-t-[3px] border-t-brand-red bg-white p-6 sm:p-8">
      <h3 className="font-heading text-[18px] font-extrabold uppercase text-brand-black">
        Project inquiry
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-brand-gray">
        Fields marked with an asterisk are required.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className={labelClass}>
            Full name <span className="text-brand-red">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            value={form.full_name}
            onChange={update("full_name")}
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            className={fieldClass}
          />
          {errors.full_name && (
            <p id="full_name-error" className="mt-1.5 text-[11.5px] text-brand-red">
              {errors.full_name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="organization" className={labelClass}>
            Company or organization
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            value={form.organization}
            onChange={update("organization")}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address <span className="text-brand-red">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-[11.5px] text-brand-red">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Contact number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="inquiry_type" className={labelClass}>
            Inquiry type <span className="text-brand-red">*</span>
          </label>
          <select
            id="inquiry_type"
            name="inquiry_type"
            value={form.inquiry_type}
            onChange={update("inquiry_type")}
            aria-invalid={Boolean(errors.inquiry_type)}
            aria-describedby={errors.inquiry_type ? "inquiry_type-error" : undefined}
            className={fieldClass}
          >
            <option value="">Select an inquiry type</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.inquiry_type && (
            <p id="inquiry_type-error" className="mt-1.5 text-[11.5px] text-brand-red">
              {errors.inquiry_type}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="project_location" className={labelClass}>
            Project location
          </label>
          <input
            id="project_location"
            name="project_location"
            type="text"
            value={form.project_location}
            onChange={update("project_location")}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Estimated budget <span className="normal-case tracking-normal text-brand-muted">(optional)</span>
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            value={form.budget}
            onChange={update("budget")}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="timeline" className={labelClass}>
            Project timeline <span className="normal-case tracking-normal text-brand-muted">(optional)</span>
          </label>
          <input
            id="timeline"
            name="timeline"
            type="text"
            value={form.timeline}
            onChange={update("timeline")}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          Message or project requirements <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Describe the scope of works, site conditions, and any target dates."
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-[11.5px] text-brand-red">
            {errors.message}
          </p>
        )}
      </div>

      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={update("website")}
        />
      </div>

      {status === "error" && serverError && (
        <div role="alert" className="mt-5 flex items-start gap-2.5 border border-brand-red/30 bg-brand-red/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
          <p className="text-[12.5px] leading-relaxed text-brand-black">
            {serverError} You may also email{" "}
            <a href="mailto:inquiry@thecmtbuilders.com" className="font-medium text-brand-red hover:underline">
              inquiry@thecmtbuilders.com
            </a>{" "}
            or call{" "}
            <a href="tel:+639176310707" className="font-medium text-brand-red hover:underline">
              +63 917 631 0707
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-brand-red px-7 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending inquiry
          </>
        ) : (
          <>
            Submit inquiry
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-brand-muted">
        Your details are used only to respond to this inquiry.
      </p>
    </form>
  );
}
