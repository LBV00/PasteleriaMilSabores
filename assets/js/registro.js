"use strict";

function configurarRegistro() {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const region = document.getElementById("usr-region");
    const comuna = document.getElementById("usr-comuna");

    region.addEventListener("change", () => {
        comuna.innerHTML = '<option value="">-- Seleccionar comuna --</option>';
        (REGIONES_COMUNAS[region.value] || []).forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            comuna.appendChild(option);
        });
        comuna.value = "";
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario(form)) {
            mostrarMensajeFormulario(form, "Revisa los campos marcados antes de continuar.");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("mil_sabores_usuarios") || "[]");
        const usuario = {
            run: document.getElementById("usr-run").value.trim().toUpperCase(),
            nombre: document.getElementById("usr-nombre").value.trim(),
            apellidos: document.getElementById("usr-apellidos").value.trim(),
            email: document.getElementById("usr-email").value.trim().toLowerCase(),
            nacimiento: document.getElementById("usr-nacimiento").value,
            region: region.value,
            comuna: comuna.value,
            direccion: document.getElementById("usr-direccion").value.trim(),
            rol: "Cliente"
        };

        if (usuarios.some(u => u.email === usuario.email || u.run === usuario.run)) {
            mostrarMensajeFormulario(form, "Ya existe un usuario con ese RUN o correo.");
            return;
        }

        usuarios.push(usuario);
        localStorage.setItem("mil_sabores_usuarios", JSON.stringify(usuarios));
        form.reset();
        comuna.innerHTML = '<option value="">-- Seleccionar comuna --</option>';
        form.querySelectorAll(".is-valid").forEach(c => c.classList.remove("is-valid"));
        mostrarMensajeFormulario(form, "Cuenta creada correctamente.", true);
    });

    configurarCamposEnVivo(form);
}
