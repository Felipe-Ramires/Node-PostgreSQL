document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3333/reserva';
    
    const reservaForm = document.getElementById('reservaForm');
    const reservaId = document.getElementById('reservaId');
    const hotelInput = document.getElementById('hotel');
    const quartoInput = document.getElementById('quarto');
    const valorInput = document.getElementById('valor');
    const salvarBtn = document.getElementById('salvarBtn');
    const limparBtn = document.getElementById('limparBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const reservasList = document.getElementById('reservasList');
    
    carregarReservas();
    
    reservaForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const reserva = {
            hotel: hotelInput.value,
            quarto: quartoInput.value,
            valor: parseFloat(valorInput.value)
        };
        
        try {
            if (reservaId.value) {
                await fetch(`${API_URL}/${reservaId.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reserva)
                });
            } else {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reserva)
                });
            }
            
            limparFormulario();
            carregarReservas();
        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
        }
    });
    
    limparBtn.addEventListener('click', limparFormulario);
    
    searchBtn.addEventListener('click', carregarReservas);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            carregarReservas();
        }
    });
    
    async function carregarReservas() {
        try {
            let url = API_URL;
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                url += `?search=${encodeURIComponent(searchTerm)}`;
            }
            
            const response = await fetch(url);
            const reservas = await response.json();
            
            exibirReservas(reservas);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
        }
    }
    
    function exibirReservas(reservas) {
        reservasList.innerHTML = '';
        
        if (reservas.length === 0) {
          reservasList.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
          return;
        }
      
        reservas.forEach(reserva => {
          const reservaItem = document.createElement('div');
          reservaItem.className = 'reserva-item';
          
          // Convertendo valor para número antes de usar toFixed()
          const valor = typeof reserva.valor === 'string' ? 
                       parseFloat(reserva.valor) : 
                       reserva.valor;
          
          reservaItem.innerHTML = `
            <div>
              <strong>${reserva.hotel}</strong><p>Quarto ${reserva.quarto}<h3><br>
              R$ ${valor.toFixed(2)}
            </div>
            <div class="reserva-actions">
              <button class="editar" data-id="${reserva.id}">Editar</button>
              <button class="excluir" data-id="${reserva.id}">Excluir</button>
            </div>
          `;
           
            reservasList.appendChild(reservaItem);
        });
        
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', editarReserva);
        });
        
        document.querySelectorAll('.excluir').forEach(btn => {
            btn.addEventListener('click', excluirReserva);
        });
    }
    
    async function editarReserva(e) {
        const id = e.target.getAttribute('data-id');
        
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const reserva = await response.json();
            
            reservaId.value = id;
            hotelInput.value = reserva.hotel;
            quartoInput.value = reserva.quarto;
            valorInput.value = reserva.valor;
            
            salvarBtn.textContent = 'Atualizar';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao carregar reserva para edição:', error);
        }
    }
    
    async function excluirReserva(e) {
        const id = e.target.getAttribute('data-id');
        
        if (confirm('Tem certeza que deseja excluir esta reserva?')) {
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                
                carregarReservas();
                
                if (reservaId.value === id) {
                    limparFormulario();
                }
            } catch (error) {
                console.error('Erro ao excluir reserva:', error);
            }
        }
    }
    
    function limparFormulario() {
        reservaId.value = '';
        reservaForm.reset();
        salvarBtn.textContent = 'Salvar';
    }
});