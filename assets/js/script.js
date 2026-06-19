// ============================================
// SELECAO DE ELEMENTOS DA PAGINA
// ============================================

// Seletor da Secao About
const about = document.querySelector('#about');

// Seletor da Secao Projects (Carrossel)
const swiperWrapper = document.querySelector('.swiper-wrapper');

// Seletor do Formulario
const formulario = document.querySelector('#formulario');

// Regex de validacao do e-mail
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// ============================================
// BUSCAR DADOS DO PERFIL DO GITHUB
// ============================================
async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/talitatech');
        const perfil = await resposta.json();

        about.innerHTML = '';

        about.innerHTML = `
            <figure class="about-image">
                <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}">
            </figure>

            <article class="about-content">
                <h2>Sobre mim</h2>
                <p>
                    Sou Desenvolvedora de Software com mais de 4 anos de experiencia em aplicacoes web, mobile e backend. Fiz a transicao de Ciencias Contabeis, pelo Mackenzie, para a tecnologia, e esse olhar de negocios se tornou meu maior diferencial: entendo o problema antes de escrever qualquer linha de codigo.
                </p>

                <p>
                    Atuei na Ame Digital em produtos financeiros como Emprestimo FGTS e Consignado, utilizados por milhoes de pessoas. Na WURA, contribuo com projetos de impacto social, como o Penhas App, presente em mais de 2 mil cidades brasileiras. Atualmente, curso Analise e Desenvolvimento de Sistemas na FIAP e um Bootcamp Full Stack Java na Generation Brasil.
                </p>

                <div class="about-buttons-data">
                    <div class="buttons-container">
                        <a href="${perfil.html_url}" target="_blank" class="botao">GitHub</a>
                        <a href="https://www.linkedin.com/in/talitasantosdev/" target="_blank" class="botao-outline">LinkedIn</a>
                    </div>

                    <div class="data-container">
                        <div class="data-item">
                            <span class="data-number">${perfil.followers}</span>
                            <span class="data-label">Seguidores</span>
                        </div>
                        <div class="data-item">
                            <span class="data-number">${perfil.public_repos}</span>
                            <span class="data-label">Repositorios</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    } catch (error) {
        console.error('Erro ao buscar dados do usuario:', error);
    }
}

getAboutGithub();

// ============================================
// BUSCAR REPOSITORIOS DO GITHUB
// ============================================
async function getProjectsGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/talitatech/repos?sort=updated&per_page=10');
        const repositorios = await resposta.json();

        swiperWrapper.innerHTML = '';

        const linguagens = {
            'JavaScript': 'javascript',
            'TypeScript': 'typescript',
            'Python': 'python',
            'Java': 'java',
            'HTML': 'html',
            'CSS': 'css',
            'GitHub': 'github',
        };

        const repositoriosFiltrados = repositorios.filter(repo => repo.name !== 'portifolio-gen');

        repositoriosFiltrados.forEach(repositorio => {
            const linguagem = repositorio.language || 'GitHub';
            const logo = linguagens[linguagem] ?? linguagens['GitHub'];
            const urlLogo = `./assets/icons/languages/${logo}.svg`;

            const nomeFormatado = repositorio.name
                .replace(/[-_]/g, ' ')
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .toUpperCase();

            const truncar = (texto, limite) =>
                texto.length > limite
                    ? texto.substring(0, limite) + '...'
                    : texto;

            const descricao = repositorio.description
                ? truncar(repositorio.description, 100)
                : 'Projeto desenvolvido no GitHub';

            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('')
                : `<span class="tag">${linguagem}</span>`;

            const botaoDeploy = repositorio.homepage
                ? `<a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>`
                : '';

            const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">
                        GitHub
                    </a>
                    ${botaoDeploy}
                </div>
            `;

            swiperWrapper.innerHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlLogo}"
                                alt="Icone ${linguagem}"
                                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </div>

                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;
        });

        iniciarSwiper();

    } catch (error) {
        console.error('Erro ao buscar repositorios:', error);
    }
}

getProjectsGithub();

// ============================================
// CARROSSEL - SWIPER
// ============================================
function iniciarSwiper() {
    new Swiper('.projects-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        centeredSlides: false,
        loop: true,
        watchOverflow: true,

        breakpoints: {
            0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 40,
                centeredSlides: false,
            },
            769: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 40,
                centeredSlides: false,
            },
            1025: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 54,
                centeredSlides: false,
            },
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },

        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },

        grabCursor: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
    });
}

// ============================================
// VALIDACAO DE FORMULARIO
// ============================================
formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    document.querySelectorAll('form span')
        .forEach(span => span.innerHTML = '');

    let isValid = true;

    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');

    if (nome.value.trim().length < 3) {
        erroNome.innerHTML = 'O nome deve ter no minimo 3 caracteres.';
        if (isValid) nome.focus();
        isValid = false;
    }

    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');

    if (!email.value.trim().match(emailRegex)) {
        erroEmail.innerHTML = 'Digite um e-mail valido.';
        if (isValid) email.focus();
        isValid = false;
    }

    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');

    if (assunto.value.trim().length < 5) {
        erroAssunto.innerHTML = 'O assunto deve ter no minimo 5 caracteres.';
        if (isValid) assunto.focus();
        isValid = false;
    }

    const mensagem = document.querySelector('#mensagem');
    const erroMensagem = document.querySelector('#erro-mensagem');

    if (mensagem.value.trim().length === 0) {
        erroMensagem.innerHTML = 'A mensagem nao pode ser vazia.';
        if (isValid) mensagem.focus();
        isValid = false;
    }

    if (isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        formulario.submit();
    }
});
