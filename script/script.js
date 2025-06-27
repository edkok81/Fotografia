document.addEventListener('DOMContentLoaded', () => {
    // 1. Zoom discreto e abrir imagem em tela cheia
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('img01');
    const closeButton = document.querySelector('.close-button');

    portfolioImages.forEach(image => {
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = image.src;
        });
    });

    // Fechar o modal ao clicar no botão de fechar
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar o modal ao clicar fora da imagem
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 2. Download do currículo
    const downloadButton = document.getElementById('downloadCurriculo');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            // Substituir 'caminho/do/curriculo.pdf' pelo caminho real do arquivo.
            // Certificar que o arquivo esteja no diretório correto no servidor.
            const cvPath = '/docs/curriculo.pdf'; // Exemplo: se o currículo estiver em uma pasta 'docs'
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'Curriculo_Caê_Kokubo.pdf'; // Nome do arquivo quando for baixado
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // 3. Envio do formulário de contato para o email
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Para usar formsubmit.co, você só precisa garantir que o action do formulário
        // aponte para o endpoint deles com o seu e-mail e que os campos de input
        // tenham os atributos `name` corretos conforme a documentação do FormSubmit.
        // Já ajustei isso diretamente no seu HTML.

        // Você pode adicionar uma mensagem de sucesso/erro aqui após o envio, se desejar.
        // O FormSubmit.co já lida com o redirecionamento ou exibe uma mensagem padrão.
        contactForm.addEventListener('submit', async (event) => {
            // O FormSubmit já cuida do envio, então não precisamos de um fetch complexo aqui.
            // Podemos, no entanto, adicionar uma validação extra se necessário.
            // Por exemplo, uma mensagem de "enviando..." enquanto aguarda.

            // Remova o preventDefault() se quiser que o FormSubmit.co cuide do redirecionamento padrão.
            // Se você quiser um comportamento customizado (ex: manter na página e mostrar um pop-up de sucesso),
            // então você precisaria de um backend próprio ou usar AJAX com um serviço de e-mail.
            // Para simplicidade e o que foi pedido, manteremos o comportamento padrão do FormSubmit.
            console.log('Formulário enviado!');
        });
    }
});