/* Supabase Integration - Grupo Rugido */

// Máscara de telefone brasileiro (00) 00000-0000
function setupPhoneMask() {
    const phoneInput = document.getElementById('lp-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);

        if (value.length === 0) {
            e.target.value = '';
            return;
        }
        if (value.length <= 2) {
            e.target.value = '(' + value;
            return;
        }
        if (value.length <= 7) {
            e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            return;
        }
        if (value.length <= 10) {
            e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
            return;
        }
        e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
    });

    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
            const val = e.target.value;
            if (val.endsWith(') ') || val.endsWith('-')) {
                e.target.value = val.slice(0, -2);
                e.preventDefault();
            }
        }
    });
}

// Configuração do Supabase
const supabaseUrl = 'https://zyflizbsdbzowcgoiyaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZmxpemJzZGJ6b3d3em9jZ29peWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjk5NTIsImV4cCI6MjA5MTkwNTk1Mn0.bC9cVjyhPnUOYrHJofHy99RbF6B5I4vgMZSfwmhsPyg';

// Aguarda o DOM estar pronto e o Supabase carregado
function initSupabaseIntegration() {
    // Verifica se o Supabase está disponível
    if (typeof window.supabase === 'undefined') {
        setTimeout(initSupabaseIntegration, 1000);
        return;
    }

    try {
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        // Encontra o formulário
        const form = document.getElementById('lp-form');
        if (!form) return;

        // Remove listener anterior se existir
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        // Configura máscara de telefone DEPOIS de clonar o formulário
        setupPhoneMask();

        // Adiciona listener ao formulário
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = newForm.querySelector('.lp-submit');
            const submitBtnOriginalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;">Enviando...</span>';
            submitBtn.disabled = true;

            const leadData = {
                nome: document.getElementById('lp-nome').value,
                email: document.getElementById('lp-email').value,
                phone: document.getElementById('lp-phone').value,
                empresa: document.getElementById('lp-empresa').value,
                setor: document.getElementById('lp-setor').value,
                faturamento: document.getElementById('lp-fat').value
            };

            try {
                const { data, error } = await supabase
                    .from('leads')
                    .insert([leadData]);

                if (error) throw error;

                // Esconde o formulário e mostra sucesso
                newForm.querySelectorAll('.lp-row').forEach(r => r.style.display = 'none');
                submitBtn.style.display = 'none';

                const success = document.getElementById('lp-success');
                if (success) success.style.display = 'block';

                // Redireciona para o Grupo Rugido após 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'https://gruporugido.com/obrigado/';
                }, 1500);

            } catch (error) {
                submitBtn.innerHTML = submitBtnOriginalContent;
                submitBtn.disabled = false;

                let errorMessage = 'Erro ao enviar. Tente novamente ou entre em contato.';
                alert(errorMessage);
            }
        });
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
    }
}

// Inicializa quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseIntegration);
} else {
    initSupabaseIntegration();
}
