import { useState } from "react";

export default function FormularioFifa() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    equipo: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!form.apellido.trim()) e.apellido = "Ingresá tu nick";
    if (!form.correo.trim() || !/\S+@\S+\.\S+/.test(form.correo))
      e.correo = "Ingresá un correo válido";
    if (!form.equipo.trim()) e.equipo = "Ingresá el nombre de tu equipo";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setEnviado(true);
  };

    const styles = {
    page: {
    width:"100%",
    height: "100vh", 
    overflow: "hidden",
    backgroundImage: "url('https://image.api.playstation.com/vulcan/ap/rnd/202206/1611/8P0xPO6eNmRLnRkoZUli2Uod.png')",
    backgroundSize: "cover",        // ESTO es lo que hace que se estire para cubrir todo
    backgroundPosition: "center",   // Centra la imagen
    backgroundRepeat: "no-repeat",  // ESTO evita que se repita
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    padding: "0 0",
    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
    position: "fixed",
    inset: 0,
    },
    card: {
      width: "100%",
      maxWidth: 480,
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    },
    header: {
      background: "linear-gradient(135deg, #00b140 0%, #006d26 100%)",
      padding: "2rem 2rem 1.6rem",
      position: "relative",
      overflow: "hidden",
    },
    headerAccent: {
      position: "absolute",
      top: -40,
      right: -40,
      width: 160,
      height: 160,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
    },
    headerAccent2: {
      position: "absolute",
      bottom: -30,
      left: -20,
      width: 100,
      height: 100,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
    },
    badge: {
      display: "inline-block",
      background: "rgba(142, 142, 142, 0.18)",
      color: "#fff",
      fontSize: 11,
      fontFamily: "'Barlow', sans-serif",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: 30,
      marginBottom: "0.75rem",
    },
    h1: {
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: 42,
      fontWeight: 400,
      color: "#fff",
      margin: "0 0 4px",
      letterSpacing: "0.02em",
      lineHeight: 1,
      position: "relative",
    },
    h2: {
      fontFamily: "'Barlow', sans-serif",
      fontSize: 13,
      fontWeight: 600,
      color: "rgba(255,255,255,0.75)",
      margin: "0 0 6px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      position: "relative",
    },
    tagline: {
      fontFamily: "'Barlow', sans-serif",
      fontSize: 14,
      fontWeight: 400,
      color: "rgba(255,255,255,0.6)",
      margin: 0,
      position: "relative",
    },
    body: {
      padding: "2rem",
    },
    field: {
      marginBottom: "1.25rem",
    },
    label: {
      display: "block",
      fontFamily: "'Barlow', sans-serif",
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(11, 11, 11)",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      background: "rgba(255, 255, 255, 0.50)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 10,
      padding: "11px 14px",
      fontSize: 15,
      fontFamily: "'Barlow', sans-serif",
      color: "#000000",
      outline: "none",
      transition: "border-color 0.2s, background 0.2s",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#e05c5c",
      background: "rgba(224,92,92,0.08)",
    },
    errorMsg: {
      fontFamily: "'Barlow', sans-serif",
      fontSize: 12,
      color: "#e05c5c",
      marginTop: 4,
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    divider: {
      border: "none",
      borderTop: "1px solid rgba(0, 0, 0, 0.08)",
      margin: "0.5rem 0 1.5rem",
    },
    submitBtn: {
      width: "100%",
      background: "linear-gradient(135deg, #00b140 0%, #00832e 100%)",
      border: "none",
      borderRadius: 10,
      padding: "14px",
      fontSize: 16,
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      letterSpacing: "0.1em",
      color: "#fff",
      cursor: "pointer",
      transition: "opacity 0.2s, transform 0.1s",
    },
    successBox: {
      padding: "2.5rem 2rem",
      textAlign: "center",
    },
    successIcon: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #00b140, #006d26)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.25rem",
      fontSize: 28,
    },
    successTitle: {
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: 30,
      color: "#000000",
      margin: "0 0 8px",
      letterSpacing: "0.02em",
    },
    successText: {
      fontFamily: "'Barlow', sans-serif",
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.55)",
      margin: 0,
    },
    successName: {
      color: "#000000",
    },
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.headerAccent} />
            <div style={styles.headerAccent2} />
            <div style={styles.badge}>⚽ Torneo Oficial</div>
            <h1 style={styles.h1}>Inscripción al torneo de FIFA</h1>
            <p style={styles.h2}>Instituto Leibnitz</p>
            <p style={styles.tagline}>¡Vení y demostrá tu habilidad jugando con nosotros!</p>
          </div>
          {!enviado ? (
            <div style={styles.body}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Nombre</label>
                    <input
                      style={{ ...styles.input, ...(errors.nombre ? styles.inputError : {}) }}
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Lucas"
                      autoComplete="given-name"
                    />
                    {errors.nombre && <p style={styles.errorMsg}>{errors.nombre}</p>}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Nick</label>
                    <input
                      style={{ ...styles.input, ...(errors.Nick ? styles.inputError : {}) }}
                      name="Nick"
                      value={form.Nick}
                      onChange={handleChange}
                      placeholder="Ej: Nick"
                      autoComplete="family-name"
                    />
                    {errors.Nick && <p style={styles.errorMsg}>{errors.Nick}</p>}
                  </div>
                </div>
                <hr style={styles.divider} />
                <button
                  type="submit"
                  style={styles.submitBtn}
                  onMouseOver={(e) => (e.target.style.opacity = 0.88)}
                  onMouseOut={(e) => (e.target.style.opacity = 1)}
                  onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  ¡Me anoto al torneo!
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.successTitle}>¡Inscripción exitosa!</h2>
              <p style={styles.successText}>
                Nos vemos en la cancha,{" "}
                <span style={styles.successName}>
                  {form.nombre} del equipo {form.equipo}
                </span>
                . Confirmamos tu inscripción a <strong style={{ color: "#fff" }}>{form.correo}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}