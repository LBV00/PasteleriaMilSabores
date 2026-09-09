/**
 * contacto.js
 * Lógica del formulario de contacto:
 *  - Validación de campos con feedback visual
 *  - Contador de caracteres en el textarea
 *  - Guarda los mensajes en localStorage
 *  - Muestra confirmación de envío
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-contacto');
    const alertaExito = document.getElementById('alerta-exito');
    const btnEnviar = document.getElementById('btn-enviar');
    const txtMensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contador-mensaje');
    const errorMsg = document.getElementById('error-mensaje');
    const MAX_CHARS = 500;

    // ─────────────────────────────────────────
    // CONTADOR DE CARACTERES
    // ─────────────────────────────────────────
    txtMensaje.addEventListener('input', () => {
        const len = txtMensaje.value.length;
        contador.textContent = `${len} / ${MAX_CHARS}`;

        if (len >= MAX_CHARS * 0.9) {
            contador.classList.add('text-danger', 'fw-bold');
            contador.classList.remove('text-muted');
        } else if (len >= MAX_CHARS * 0.7) {
            contador.classList.add('text-warning', 'fw-bold');
            contador.classList.remove('text-muted', 'text-danger');
        } else {
            contador.classList.remove('text-danger', 'text-warning', 'fw-bold');
            contador.classList.add('text-muted');
        }

        // Ocultar error de mensaje si el usuario ya escribio algo
        if (len > 0) {
            txtMensaje.classList.remove('is-invalid');
            errorMsg.style.visibility = 'hidden';
        }
    });


    // ─────────────────────────────────────────
    // VALIDACIÓN EN TIEMPO REAL
    // ─────────────────────────────────────────
    const camposSimples = ['nombre', 'email', 'asunto'];

    camposSimples.forEach(id => {
        const input = document.getElementById(id);

        input.addEventListener('blur', () => validarCampo(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validarCampo(input);
            }
        });
    });

    function validarCampo(input) {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        }
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    function validarMensaje() {
        const vacio = txtMensaje.value.trim() === '';
        if (vacio) {
            txtMensaje.classList.add('is-invalid');
            txtMensaje.classList.remove('is-valid');
            errorMsg.style.visibility = 'visible';
            return false;
        }
        txtMensaje.classList.remove('is-invalid');
        txtMensaje.classList.add('is-valid');
        errorMsg.style.visibility = 'hidden';
        return true;
    }


    // ─────────────────────────────────────────
    // ENVÍO DEL FORMULARIO
    // ─────────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todos los campos
        let formValido = true;

        camposSimples.forEach(id => {
            const input = document.getElementById(id);
            if (!validarCampo(input)) formValido = false;
        });

        if (!validarMensaje()) formValido = false;

        if (!formValido) return;

        // Guardar en localStorage
        const mensaje = {
            id: Date.now(),
            fecha: new Date().toLocaleString('es-CL'),
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            asunto: document.getElementById('asunto').value.trim(),
            mensaje: txtMensaje.value.trim(),
        };

        const mensajes = JSON.parse(localStorage.getItem('mensajes-contacto') || '[]');
        mensajes.push(mensaje);
        localStorage.setItem('mensajes-contacto', JSON.stringify(mensajes));

        // Mostrar confirmacion
        alertaExito.classList.remove('d-none');
        alertaExito.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Deshabilitar boton brevemente para evitar doble envio
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Mensaje enviado';

        // Limpiar formulario
        form.reset();
        contador.textContent = '0 / 500';
        contador.className = 'text-muted ms-auto';
        errorMsg.style.visibility = 'hidden';

        // Quitar clases de validacion
        [...form.querySelectorAll('.is-valid, .is-invalid')].forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });

        // Restaurar boton despues de 4 segundos
        setTimeout(() => {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = 'Enviar mensaje';
        }, 4000);

        // Ocultar alerta despues de 6 segundos
        setTimeout(() => {
            alertaExito.classList.add('d-none');
        }, 6000);
    });

});