const botoes = document.querySelectorAll(".botao-previa");
const controlesPrevias = [];

function atualizarPrevia(controle, aberta) {
    const { botao, previa, linkProjeto, rotulo, nomeProjeto } = controle;
    const projeto = botao.closest(".projeto");
    const video = previa.querySelector("video");

    previa.hidden = !aberta;
    if (linkProjeto) {
        linkProjeto.hidden = !aberta;
    }
    if (projeto) {
        projeto.classList.toggle("projeto-aberto", aberta);
    }
    if (video) {
        if (aberta) {
            video.load();
        } else {
            video.pause();
        }
    }
    rotulo.textContent = aberta ? "Fechar prévia" : "Ver prévia";
    botao.setAttribute("aria-label", `${aberta ? "Fechar" : "Abrir"} prévia de ${nomeProjeto}`);
    botao.setAttribute("aria-expanded", String(aberta));
}

botoes.forEach(function (botao) {
    const idPrevia = botao.getAttribute("aria-controls");
    const previa = document.getElementById(idPrevia);
    if (!previa) {
        return;
    }

    const linkProjeto = previa.nextElementSibling;
    const rotulo = botao.querySelector(".rotulo-botao");
    const projeto = botao.closest(".projeto");
    const tituloProjeto = projeto ? projeto.querySelector("h3") : null;
    const nomeProjeto = botao.dataset.nomeProjeto || (tituloProjeto ? tituloProjeto.textContent : "este trabalho");
    const controle = { botao, previa, linkProjeto, rotulo, nomeProjeto };

    controlesPrevias.push(controle);

    botao.addEventListener("click", function () {
        const deveAbrir = previa.hidden;

        controlesPrevias.forEach(function (outroControle) {
            if (outroControle !== controle) {
                atualizarPrevia(outroControle, false);
            }
        });

        atualizarPrevia(controle, deveAbrir);
    });
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        controlesPrevias.forEach(function (controle) {
            atualizarPrevia(controle, false);
        });
    }
});

const cartaoMova = document.querySelector(".cartao-mova");
const hero = document.querySelector(".hero");

if (cartaoMova && hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (evento) {
        const limites = hero.getBoundingClientRect();
        const x = (evento.clientX - limites.left) / limites.width - 0.5;
        const y = (evento.clientY - limites.top) / limites.height - 0.5;

        cartaoMova.style.setProperty("--cartao-x", `${x * 14}px`);
        cartaoMova.style.setProperty("--cartao-y", `${y * 14}px`);
    });

    hero.addEventListener("pointerleave", function () {
        cartaoMova.style.setProperty("--cartao-x", "0px");
        cartaoMova.style.setProperty("--cartao-y", "0px");
    });
}

const elementosRevelar = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {
    document.body.classList.add("pronto-para-revelar");

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12 });

    elementosRevelar.forEach(function (elemento) {
        observador.observe(elemento);
    });
}

const barraProgresso = document.querySelector(".progresso-rolagem span");

function atualizarProgressoRolagem() {
    const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaRolavel > 0 ? window.scrollY / alturaRolavel : 0;

    barraProgresso.style.transform = `scaleX(${progresso})`;
}

if (barraProgresso) {
    atualizarProgressoRolagem();
    window.addEventListener("scroll", atualizarProgressoRolagem, { passive: true });
    window.addEventListener("resize", atualizarProgressoRolagem);
}

const secoes = document.querySelectorAll("main section[id]");
const linksNavegacao = document.querySelectorAll(".navegacao a");

if ("IntersectionObserver" in window) {
    const observadorNavegacao = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const seletor = `a[href="#${entrada.target.id}"]`;

                linksNavegacao.forEach(function (link) {
                    link.removeAttribute("aria-current");
                });

                const linkAtivo = document.querySelector(`.navegacao ${seletor}`);
                if (linkAtivo) {
                    linkAtivo.setAttribute("aria-current", "page");
                }
            }
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    secoes.forEach(function (secao) {
        observadorNavegacao.observe(secao);
    });
}
