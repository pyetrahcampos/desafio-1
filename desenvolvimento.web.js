const parkingForm = document.getElementById("EstacionamentoForm");
const parkingData = document.getElementById("EstacionamentoData");
const modal = document.getElementById("modalEstacionamento");
const btnOpenModal = document.getElementById("btnOpenModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnSubmit = document.getElementById("btnSubmit");
const modalTitle = document.getElementById("modalTitle");

let database = JSON.parse(localStorage.getItem('parkflow_db')) || [];
let isEditing = false;
let editIndex = null;


btnOpenModal.onclick = () => {
    isEditing = false;
    EstacionamentoForm.reset();
    modalTitle.innerText = "Nova Reserva de Vaga";
    btnSubmit.innerText = "Confirmar Reserva";
    modal.style.display = "flex";
};

btnCloseModal.onclick = () => modal.style.display = "none";


EstacionamentoForm.onsubmit = (e) => {
    e.preventDefault();

    const entry = {
        placa: document.getElementById("placa").value.toUpperCase(),
        proprietario: document.getElementById("proprietario").value,
        bloco: document.getElementById("bloco").value,
        apartamento: document.getElementById("apartamento").value,
        modelo: document.getElementById("modelo").value,
        cor: document.getElementById("cor").value,
        vaga: document.getElementById("vaga").value
    };

    
    const isVagaOcupada = database.some((item, index) => 
        item.vaga === entry.vaga && (!isEditing || index !== editIndex)
    );

    if (isVagaOcupada) {
        alert("Atenção: Esta vaga já está vinculada a outro veículo!");
        return;
    }

    if (isEditing) {
        database[editIndex] = entry;
        console.log("Registro atualizado:", entry);
    } else {
        database.push(entry);
        console.log("Novo registro efetuado:", entry);
    }

    updateStorage();
    renderTable();
    modal.style.display = "none";
    alert("Operação realizada com sucesso!");
};

function renderTable() {
    EstacionamentoData.innerHTML = "";
    
    database.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.vaga}</strong></td>
            <td>${item.placa}</td>
            <td>${item.proprietario}</td>
            <td>${item.bloco} - ${item.apartamento}</td>
            <td>${item.modelo} (${item.cor})</td>
            <td><span class="status-badge">Ocupada</span></td>
            <td>
                <button onclick="prepareEdit(${index})" class="btn btn-warning">editar</button>
                <button onclick="removeItem(${index})" class="btn btn-danger">excluir</button>
            </td>
        `;
        EstacionamentoData.appendChild(row);
    });
}

window.prepareEdit = (index) => {
    isEditing = true;
    editIndex = index;
    const item = database[index];

    document.getElementById("placa").value = item.placa;
    document.getElementById("proprietario").value = item.proprietario;
    document.getElementById("bloco").value = item.bloco;
    document.getElementById("apartamento").value = item.apartamento;
    document.getElementById("modelo").value = item.modelo;
    document.getElementById("cor").value = item.cor;
    document.getElementById("vaga").value = item.vaga;

    modalTitle.innerText = "Editar Reserva";
    btnSubmit.innerText = "Salvar Alterações";
    modal.style.display = "flex";
};

window.removeItem = (index) => {
    if (confirm("Deseja realmente liberar esta vaga?")) {
        database.splice(index, 1);
        updateStorage();
        renderTable();
    }
};

function updateStorage() {
    localStorage.setItem('Estacionamento_db', JSON.stringify(database));
}


renderTable();
