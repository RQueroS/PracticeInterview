const d = document,
    $table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment();

const ajax = (options) => {
    let { url, method, success, error, data } = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let message = xhr.statusText || "Ocurrió un error";
            error("Error " + xhr.status + ": " + message);
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
};

const getAll = () => {
    ajax({
        method: "GET",
        url: "http://localhost:3000/persons",
        success: (res) => {
            console.log(res)
            res.forEach(el => {
                $template.querySelector(".name").textContent = el.firstName;
                $template.querySelector(".lastName").textContent = el.lastName;
                $template.querySelector(".dateOfBirth").textContent = el.dateOfBirth;
                $template.querySelector(".active").textContent = el.active;
                $template.querySelector(".age").textContent = el.age;
                $template.querySelector(".edit").dataset.id = el.id;
                $template.querySelector(".edit").dataset.nombre = el.firstName;
                $template.querySelector(".edit").dataset.apellido = el.lastName;
                $template.querySelector(".edit").dataset.fecha = el.dateOfBirth;
                $template.querySelector(".edit").dataset.activo = el.active;
                $template.querySelector(".edit").dataset.edad = el.age;
                $template.querySelector(".delete").dataset.id = el.id;
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });

            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (err) => {
            console.error(err)
            $table.insertAdjacentHTML("afterend", "<p><b>" + err + "</b></p>")
        },
        data: null
    });
}

d.addEventListener("DOMContentLoaded", getAll);

function getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
        diferenciaMeses < 0 ||
        (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
        edad--
    }
    return edad
}

d.addEventListener("submit", e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            //POST
            ajax({
                url: "http://localhost:3000/persons",
                method: "POST",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", "<p><b>" + err + "</b></p>"),
                data: {
                    firstName: e.target.nombre.value,
                    lastName: e.target.apellido.value,
                    dateOfBirth: e.target.fecha.value,
                    active: ($('#active').is(':checked') ? true : false),
                    age: getEdad(e.target.fecha.value)
                }
            });




        } else {
            //PUT
            ajax({
                url: "http://localhost:3000/persons/" + e.target.id.value,
                method: "PUT",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", "<p><b>" + err + "</b></p>"),
                data: {
                    firstName: e.target.nombre.value,
                    lastName: e.target.apellido.value,
                    dateOfBirth: e.target.fecha.value,
                    active: ($('#active').is(':checked') ? true : false),
                    age: getEdad(e.target.fecha.value)
                }
            });
        }
    }
});

d.addEventListener("click", e => {
    if (e.target.matches(".edit")) {
        $form.id.value = e.target.dataset.id;
        $form.nombre.value = e.target.dataset.nombre;
        $form.apellido.value = e.target.dataset.apellido;
        $form.fecha.value = e.target.dataset.fecha;
        $form.activo.value = e.target.dataset.activo;
        $form.activo.checked = (e.target.dataset.activo == "true" ? true : false);
    } else if (e.target.matches(".delete")) {
        let isDelete = confirm("¿Estás seguro de eliminar el id " + e.target.dataset.id);
        if (isDelete) {
            //DELETE
            ajax({
                url: "http://localhost:3000/persons/" + e.target.dataset.id,
                method: "DELETE",
                success: (res) => location.reload(),
                error: () => alert(err)
            });
        }
    }
});

function clean(){
    $form.id.value = "";
    $form.nombre.value = "";
    $form.apellido.value = "";
    $form.fecha.value = "";
    $form.activo.value = "";
    $form.activo.checked = false;
    $title.textContent = "Agregar Persona";
}

function edit(){
    $title.textContent = "Editar Persona";
}