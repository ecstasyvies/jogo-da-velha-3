import { estado, inicializarJogo } from '../logica/estado.js';
import { atualizarUI, setNomeJogadores } from './interface.js';

let modal = null;

function configurarModal() {
  modal = document.getElementById('modal-instrucoes');
  const botaoComecar = document.getElementById('botao-comecar');
  const botaoRetornar = document.getElementById('botao-retornar');
  const inputNomeX = document.getElementById('nome-jogador-x');
  const inputNomeO = document.getElementById('nome-jogador-o');
  const botaoInstrucoes = document.querySelector('.jogo__botao-instrucoes');
  
  if (!modal || !botaoComecar || !botaoRetornar || !inputNomeX || !inputNomeO || !botaoInstrucoes) {
    console.error('Elementos do modal não encontrados!');
    return;
  }
  
  const abrirModal = () => {
    modal.classList.add('modal--aberto');
    
    if (estado.pecasPosicionadas.X + estado.pecasPosicionadas.O > 0) {
      botaoRetornar.classList.remove('oculto');
      botaoComecar.classList.add('oculto');
    } else {
      botaoRetornar.classList.add('oculto');
      botaoComecar.classList.remove('oculto');
    }
  };
  
  const fecharModal = () => {
    modal.classList.remove('modal--aberto');
  };
  
  const iniciarJogo = () => {
    setNomeJogadores(
      inputNomeX.value.trim() || "Jogador X",
      inputNomeO.value.trim() || "Jogador O"
    );
    fecharModal();
    inicializarJogo();
    atualizarUI();
  };
  
  const retornarAoJogo = () => {
    setNomeJogadores(
      inputNomeX.value.trim() || "Jogador X",
      inputNomeO.value.trim() || "Jogador O"
    );
    fecharModal();
    atualizarUI();
  };
  
  botaoInstrucoes.addEventListener('click', abrirModal);
  botaoComecar.addEventListener('click', iniciarJogo);
  botaoRetornar.addEventListener('click', retornarAoJogo);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--aberto')) {
      fecharModal();
    }
  });
  
  [inputNomeX, inputNomeO].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (estado.pecasPosicionadas.X + estado.pecasPosicionadas.O > 0) {
          retornarAoJogo();
        } else {
          iniciarJogo();
        }
      }
    });
  });
}

export {
  modal,
  configurarModal
};