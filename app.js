// Simulação de API para respostas SIM/NÃO
class YesNoAPI {
    constructor() {
        this.responses = ['SIM', 'NÃO'];
        this.delay = 1500; // Simula delay de API
    }

    async askQuestion(question) {
        // Simula chamada à API
        return new Promise((resolve) => {
            setTimeout(() => {
                // Lógica simples para determinar resposta baseada na pergunta
                const response = this.generateResponse(question);
                resolve({
                    answer: response,
                    question: question,
                    timestamp: new Date().toISOString()
                });
            }, this.delay);
        });
    }

    generateResponse(question) {
        // Algoritmo simples para gerar respostas baseado em palavras-chave
        const lowerQuestion = question.toLowerCase();
        
        // Palavras que tendem a gerar "SIM"
        const positiveKeywords = [
            'bom', 'boa', 'melhor', 'deve', 'deveria', 'posso', 'consigo',
            'vale a pena', 'recomenda', 'gosta', 'amor', 'feliz', 'sucesso',
            'possível', 'fácil', 'simples', 'certo', 'correto', 'verdade'
        ];
        
        // Palavras que tendem a gerar "NÃO"
        const negativeKeywords = [
            'ruim', 'pior', 'não', 'nunca', 'impossível', 'difícil',
            'errado', 'mentira', 'falso', 'problema', 'perigo', 'risco',
            'medo', 'triste', 'fracasso', 'complicado'
        ];
        
        let positiveScore = 0;
        let negativeScore = 0;
        
        // Conta palavras positivas e negativas
        positiveKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) {
                positiveScore++;
            }
        });
        
        negativeKeywords.forEach(keyword => {
            if (lowerQuestion.includes(keyword)) {
                negativeScore++;
            }
        });
        
        // Se há mais palavras positivas, tende ao SIM
        if (positiveScore > negativeScore) {
            return Math.random() > 0.3 ? 'SIM' : 'NÃO';
        }
        // Se há mais palavras negativas, tende ao NÃO
        else if (negativeScore > positiveScore) {
            return Math.random() > 0.3 ? 'NÃO' : 'SIM';
        }
        // Caso contrário, resposta aleatória
        else {
            return this.responses[Math.floor(Math.random() * this.responses.length)];
        }
    }
}

// Instância da API
const yesNoAPI = new YesNoAPI();

// Elementos DOM
const questionInput = document.getElementById('questionInput');
const submitBtn = document.getElementById('submitBtn');
const responseSection = document.getElementById('responseSection');
const responseText = document.getElementById('responseText');

// Estado da aplicação
let isLoading = false;

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Foco automático no campo de entrada
    questionInput.focus();
    
    // Enter para enviar
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isLoading) {
            submitQuestion();
        }
    });
    
    // Limpar resposta quando começar a digitar nova pergunta
    questionInput.addEventListener('input', function() {
        if (responseText.textContent && responseText.textContent !== '') {
            clearResponse();
        }
    });
});

// Função principal para enviar pergunta
async function submitQuestion() {
    const question = questionInput.value.trim();
    
    // Validação
    if (!question) {
        showError('Por favor, digite uma pergunta.');
        return;
    }
    
    if (question.length < 3) {
        showError('A pergunta deve ter pelo menos 3 caracteres.');
        return;
    }
    
    // Iniciar loading
    startLoading();
    
    try {
        // Chamar API
        const result = await yesNoAPI.askQuestion(question);
        
        // Mostrar resposta
        showResponse(result.answer);
        
        // Log para debug (pode ser removido em produção)
        console.log('Pergunta:', question);
        console.log('Resposta:', result.answer);
        
    } catch (error) {
        console.error('Erro ao processar pergunta:', error);
        showError('Erro ao processar sua pergunta. Tente novamente.');
    } finally {
        stopLoading();
    }
}

// Iniciar estado de loading
function startLoading() {
    isLoading = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading"></div>';
    responseText.innerHTML = '<div class="loading"></div>';
    responseSection.classList.add('active');
}

// Parar estado de loading
function stopLoading() {
    isLoading = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar';
}

// Mostrar resposta
function showResponse(answer) {
    responseText.textContent = answer;
    responseText.className = 'response-text ' + (answer === 'SIM' ? 'sim' : 'nao');
    responseSection.classList.add('active');
    
    // Adicionar efeito sonoro visual
    if (answer === 'SIM') {
        createConfetti();
    } else {
        createShakeEffect();
    }
}

// Mostrar erro
function showError(message) {
    responseText.textContent = message;
    responseText.className = 'response-text error';
    responseText.style.color = '#e74c3c';
    responseText.style.fontSize = '1.2rem';
    responseSection.classList.add('active');
    
    // Remover erro após 3 segundos
    setTimeout(() => {
        clearResponse();
    }, 3000);
}

// Limpar resposta
function clearResponse() {
    responseText.textContent = '';
    responseText.className = 'response-text';
    responseText.style.color = '';
    responseText.style.fontSize = '';
    responseSection.classList.remove('active');
}

// Efeito confetti para resposta SIM
function createConfetti() {
    const colors = ['#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            // Remover após animação
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

// Efeito shake para resposta NÃO
function createShakeEffect() {
    responseSection.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        responseSection.style.animation = '';
    }, 500);
}

// CSS para animações dinâmicas
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .error {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// Funcionalidades adicionais
function resetForm() {
    questionInput.value = '';
    clearResponse();
    questionInput.focus();
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R para resetar
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetForm();
    }
    
    // Escape para limpar
    if (e.key === 'Escape') {
        clearResponse();
        questionInput.focus();
    }
});

// Prevenção de spam
let lastSubmissionTime = 0;
const originalSubmitQuestion = submitQuestion;

submitQuestion = function() {
    const now = Date.now();
    if (now - lastSubmissionTime < 1000) { // 1 segundo de cooldown
        showError('Aguarde um momento antes de fazer outra pergunta.');
        return;
    }
    lastSubmissionTime = now;
    originalSubmitQuestion();
};

// Analytics simples (opcional)
function trackQuestion(question, answer) {
    // Aqui você poderia enviar dados para Google Analytics ou outro serviço
    console.log('Question tracked:', { question, answer, timestamp: new Date() });
}

// Melhorias de acessibilidade
questionInput.setAttribute('aria-label', 'Campo para digitar sua pergunta');
submitBtn.setAttribute('aria-label', 'Enviar pergunta');
responseSection.setAttribute('aria-live', 'polite');
responseSection.setAttribute('aria-label', 'Área de resposta');