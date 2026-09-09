"use strict";


function configurarRegistro() {

    const form =
        document.getElementById(
            "form-registro"
        );

    if (!form) {
        return;
    }


    const region =
        document.getElementById(
            "region"
        );

    const comuna =
        document.getElementById(
            "comuna"
        );


    /* =====================================================
       CARGAR REGIONES
       ===================================================== */

    if (region) {

        region.innerHTML = `
            <option value="">
                Selecciona una región
            </option>
        `;


        Object.keys(
            REGIONES_COMUNAS
        ).forEach(codigo => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = codigo;

            option.textContent =
                codigo === "RM"
                    ? "Región Metropolitana"
                    : codigo === "VALPO"
                        ? "Región de Valparaíso"
                        : "Región del Biobío";


            region.appendChild(
                option
            );

        });

    }


    /* =====================================================
       CAMBIO DE REGIÓN
       ===================================================== */

    if (region && comuna) {

        region.addEventListener(
            "change",
            () => {

                comuna.innerHTML = `
                    <option value="">
                        Selecciona una comuna
                    </option>
                `;


                const comunas =
                    REGIONES_COMUNAS[
                        region.value
                    ] || [];


                comunas.forEach(
                    nombreComuna => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            nombreComuna;

                        option.textContent =
                            nombreComuna;

                        comuna.appendChild(
                            option
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       REGISTRO
       ===================================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                typeof validarFormulario ===
                "function"
            ) {

                if (
                    !validarFormulario(form)
                ) {

                    mostrarMensajeFormulario(
                        form,
                        "Revisa los campos marcados antes de continuar."
                    );

                    return;
                }

            }


            const usuario = {

                run:
                    document.getElementById(
                        "run"
                    ).value
                        .trim()
                        .toUpperCase(),

                nombre:
                    document.getElementById(
                        "nombre"
                    ).value.trim(),

                apellidos:
                    document.getElementById(
                        "apellidos"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "correo"
                    ).value
                        .trim()
                        .toLowerCase(),

                password:
                    document.getElementById(
                        "password"
                    ).value,

                nacimiento:
                    document.getElementById(
                        "fechaNacimiento"
                    ).value,

                codigoDescuento:
                    document.getElementById(
                        "codigoDescuento"
                    ).value
                        .trim()
                        .toUpperCase(),

                region:
                    region
                        ? region.value
                        : "",

                comuna:
                    comuna
                        ? comuna.value
                        : "",

                direccion:
                    document.getElementById(
                        "direccion"
                    ).value.trim(),

                rol: "Cliente"

            };


            /* =================================================
               BENEFICIO FELICES50
               ================================================= */

            if (
                usuario.codigoDescuento ===
                "FELICES50"
            ) {

                sessionStorage.setItem(
                    "mil_sabores_cupon",
                    "FELICES50"
                );

            }


            /* =================================================
               GUARDAR USUARIO
               ================================================= */

            let usuarios = [];

            try {

                usuarios =
                    JSON.parse(
                        localStorage.getItem(
                            "mil_sabores_usuarios"
                        )
                    ) || [];

            } catch {

                usuarios = [];

            }


            const existe =
                usuarios.some(
                    u =>
                        u.email ===
                            usuario.email ||
                        u.run ===
                            usuario.run
                );


            if (existe) {

                mostrarMensajeFormulario(
                    form,
                    "Ya existe un usuario con ese RUN o correo."
                );

                return;
            }


            usuarios.push(
                usuario
            );


            localStorage.setItem(
                "mil_sabores_usuarios",
                JSON.stringify(usuarios)
            );


            form.reset();


            if (comuna) {

                comuna.innerHTML = `
                    <option value="">
                        Selecciona una comuna
                    </option>
                `;

            }


            form
                .querySelectorAll(
                    ".is-valid"
                )
                .forEach(
                    campo =>
                        campo.classList.remove(
                            "is-valid"
                        )
                );


            mostrarMensajeFormulario(
                form,
                "Cuenta creada correctamente. ¡Bienvenido/a a Mil Sabores! Redirigiendo al inicio de sesión...",
                true
            );


            /* No iniciar sesión automáticamente.
               El usuario debe ir a login para autenticarse. */

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        }
    );


    if (
        typeof configurarCamposEnVivo ===
        "function"
    ) {

        configurarCamposEnVivo(form);

    }

}