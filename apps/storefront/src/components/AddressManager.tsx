"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, MapPin, Plus, Star, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type CustomerAddress = {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  department: string;
  province: string | null;
  district: string;
  postal_code: string | null;
  reference: string | null;
  is_default: boolean;
};

export function AddressManager({
  initialAddresses,
  loadState = "ready",
}: {
  initialAddresses: CustomerAddress[];
  loadState?: "ready" | "unconfigured" | "error";
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function createAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured()) return setError("Configura Supabase Auth para guardar direcciones.");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setPending(false);
      return setError("La sesión expiró. Ingresa nuevamente.");
    }
    const makeDefault = addresses.length === 0 || form.get("is_default") === "on";
    if (makeDefault && addresses.some((address) => address.is_default)) {
      const { error: defaultError } = await supabase
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("user_id", userData.user.id);
      if (defaultError) {
        setPending(false);
        return setError("No pudimos actualizar la dirección principal.");
      }
    }
    const { data, error: insertError } = await supabase
      .from("customer_addresses")
      .insert({
        user_id: userData.user.id,
        label: String(form.get("label") || "Principal").trim(),
        recipient_name: String(form.get("recipient_name") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        address_line_1: String(form.get("address_line_1") || "").trim(),
        address_line_2: String(form.get("address_line_2") || "").trim() || null,
        department: String(form.get("department") || "").trim(),
        province: String(form.get("province") || "").trim() || null,
        district: String(form.get("district") || "").trim(),
        postal_code: String(form.get("postal_code") || "").trim() || null,
        reference: String(form.get("reference") || "").trim() || null,
        is_default: makeDefault,
      })
      .select("id,label,recipient_name,phone,address_line_1,address_line_2,department,province,district,postal_code,reference,is_default")
      .single();
    setPending(false);
    if (insertError || !data) return setError("No pudimos guardar la dirección.");
    setAddresses((current) => [
      ...(makeDefault ? current.map((address) => ({ ...address, is_default: false })) : current),
      data as CustomerAddress,
    ]);
    setOpen(false);
  }

  async function removeAddress(id: number) {
    if (!window.confirm("¿Eliminar esta dirección guardada?")) return;
    setPending(true);
    setError("");
    const { error: deleteError } = await createClient()
      .from("customer_addresses")
      .delete()
      .eq("id", id);
    setPending(false);
    if (deleteError) return setError("No pudimos eliminar la dirección.");
    setAddresses((current) => current.filter((address) => address.id !== id));
  }

  return (
    <>
      <div className="account-page-title account-page-title--action">
        <div><span className="eyebrow">Entregas</span><h1>Direcciones</h1><p>Guarda ubicaciones solo cuando las necesites. Los cambios sensibles pueden requerir 2FA.</p></div>
        {loadState === "ready" && <button className="button button--dark" onClick={() => setOpen((value) => !value)}><Plus size={17} /> Nueva dirección</button>}
      </div>
      {open && (
        <form className="address-form" onSubmit={createAddress}>
          <div className="address-form__head"><div><span className="eyebrow">Nueva ubicación</span><h2>Datos de entrega</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar"><X size={18} /></button></div>
          <div className="form-grid">
            <label className="field"><span>Etiqueta</span><input name="label" required maxLength={60} placeholder="Casa, taller u obra" /></label>
            <label className="field"><span>Persona que recibe</span><input name="recipient_name" required autoComplete="name" /></label>
            <label className="field"><span>Teléfono</span><input name="phone" required autoComplete="tel" /></label>
            <label className="field"><span>Departamento</span><input name="department" required defaultValue="Lima" /></label>
            <label className="field field--full"><span>Dirección</span><input name="address_line_1" required autoComplete="street-address" /></label>
            <label className="field"><span>Interior (opcional)</span><input name="address_line_2" /></label>
            <label className="field"><span>Distrito</span><input name="district" required /></label>
            <label className="field"><span>Provincia</span><input name="province" /></label>
            <label className="field"><span>Código postal</span><input name="postal_code" /></label>
            <label className="field field--full"><span>Referencia</span><input name="reference" maxLength={300} /></label>
          </div>
          <label className="toggle-row"><input type="checkbox" name="is_default" /><i /><span>Usar como dirección principal</span></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button--primary" disabled={pending}>{pending ? "Guardando…" : "Guardar dirección"}</button>
        </form>
      )}
      {error && !open && <div className="form-error" role="alert">{error}</div>}
      {loadState !== "ready" ? (
        <div className="account-empty" role={loadState === "error" ? "alert" : "status"}>
          <span><AlertTriangle size={30} /></span>
          <h2>{loadState === "error" ? "No pudimos cargar tus direcciones" : "Direcciones no disponibles en esta vista"}</h2>
          <p>{loadState === "error" ? "Tu información no se perdió. Intenta nuevamente en unos minutos." : "La conexión de cuenta todavía no está habilitada en este entorno de preparación."}</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="account-empty"><span><MapPin size={30} /></span><h2>No hay direcciones guardadas</h2><p>Puedes agregar tu casa, taller u obra ahora o durante el checkout.</p></div>
      ) : (
        <div className="address-grid">{addresses.map((address) => <article key={address.id}><div className="address-card__head"><span><MapPin size={18} /></span><div><strong>{address.label}</strong>{address.is_default && <small><Star size={11} /> Principal</small>}</div><button onClick={() => removeAddress(address.id)} disabled={pending} aria-label={`Eliminar ${address.label}`}><Trash2 size={16} /></button></div><address><strong>{address.recipient_name}</strong><span>{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</span><span>{address.district}, {address.department}</span><span>{address.phone}</span>{address.reference && <small>Ref.: {address.reference}</small>}</address></article>)}</div>
      )}
    </>
  );
}
