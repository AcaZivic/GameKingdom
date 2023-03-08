//Zajednicke konstante
var prefiksJSON = "assets/data/";
var prefiksPage = 'pages/';
var prefiksDok = 'assets/doc/';
var prefiksSlike = 'assets/images/';
var prefiksPomocno = ''; //postaje ../
// var prefiksOnline = '/BakinoCudoDoo/';
var prefiksOnline ='/GameKingdom/';
const bodyTag = document.getElementsByTagName("body");
const strelicaObj = document.querySelector("#strelicaPocetak");
const navigacijaLink = document.querySelector("#navigacija");
var animacija = setInterval(slajderAnimacija,4000);
var funkExp = function(){};

var nizProizvoda = [];
var nizProizvodjaca = [];
var nizPlatformi = [];
var nizPegiOznaka = [];
var nizZanrova = [];
var nizPromocije = [];
var nizCboxa = [];

var nizNavigacija = [];
var nizSlider = []

//Konstante za footer
const footerLink = document.querySelector("footer .row.py-3 > div");
const footerInfo = document.querySelector("footer ul#contact");
const footerInfoObj = [{id:1,icon:"phone",txt:`&nbsp;&nbsp;063/710-5150`},{id:2,icon:"envelope",txt:`&nbsp;&nbsp;aleksandar&#46;zivic&#46;7&#46;21&#64;ict&#46;edu&#46;rs`},{id:2,icon:"map-marker-alt",txt:`&nbsp;&nbsp;Zdravka Čelara 16, Belgrade`}];
const footerIcons = document.querySelector("footer ul.d-flex");

function dohvatiPodatkePromise(nazivFajla){
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: prefiksOnline+prefiksJSON + nazivFajla,
            method: "get",
            dataType: "json", 
            success: function(response){
                resolve(response);
            },
            error: function(xhr, exception){
                var resenje ="";
            var poruka = "";
            let dat = new Date();
            if (xhr.status === 0) {
                poruka = 'Niste konektovani na internet.';
                resenje = "Proverite Vašu internet konekciju";
            } else if (xhr.status == 404) {
                poruka = 'Traženi dokument je nedostupan (404)';
                resenje = "Proverite naziv dokumenta koji tražite";
            } else if (xhr.status == 500) {
                poruka = 'Greška na serveru (500).';
                resenje = "Molimo sačekajte dok se problem ne reši";
            } else if (exception === 'parsererror') {
                poruka = 'Parsiranje traženog JSON fajla nije uspelo.';
                resenje = 'Javite se kontakt podršci !';
            } else if (exception === 'timeout') {
                poruka = 'Greška prekid na mreži zbog dugog čekanja.';
                resenje = 'Javite se Vašem internet provajderu !';
            } else if (exception === 'abort') {
                poruka = 'Ajax zahtev je obustavljen.';
                resenje = 'Javite se kontakt podršci !';

            } else {
                poruka = 'Greška !!!\n' + xhr.responseText;
                resenje = 'Javite se kontakt podršci !';

            }
            let modal = document.querySelector("#greskaModal");
            modal.querySelector("small").innerHTML = `${dat.getDate()}.${dat.getMonth()+1}.${dat.getFullYear()}.`;
            modal.querySelector(".modal-header p").innerHTML ="Greška "+xhr.status;
            modal.querySelector(".modal-header h5").innerHTML =poruka;
            modal.querySelector(".modal-body p").innerHTML =resenje;
            
            crtanjeModala(document.querySelector("#greskaModal"));
            }
        });
    })
}
// function dohvatiPodatke(nazivFajla,callBack){   
//     $.ajax({
//         url: prefiksOnline+prefiksJSON + nazivFajla,
//         method: "get",
//         dataType: "json", 
//         success: callBack,
//         error: function(xhr, exception){
            
//         }
//     })
// }


let url = window.location.pathname;
// url = url=="/"?"/index.html":url;
url = (url=='/GameKingdom/')?'/GameKingdom/index.html':url;
// console.log(url);
window.onload = async function(){
    if(url!=`${prefiksOnline}index.html` && url!=`${prefiksOnline}`) {
        prefiksPage = prefiksOnline+prefiksPage;
        prefiksSlike = prefiksOnline+prefiksSlike;
        // prefiksJSON = prefiksOnline +prefiksJSON;

    }
        //Dohvata sve potrebne JSON fajlove
        await proizovodi();
        nizNavigacija = await dohvatiPodatkePromise(`navigacija.json`);
        prikazNavigacije(nizNavigacija);
        glavniLink(url);
        prikazFooterLinkova(nizNavigacija);
        padajuciMeni();
        document.querySelector(".az-newsletter-btn").addEventListener("click",proveraNewsletter);
        prikaziBrojProizvodaUKorpi();

    
    if(url==`${prefiksOnline}index.html` || url==`${prefiksOnline}`){
            
                    nizSlider = await dohvatiPodatkePromise("slider.json");

                    //Prikaz dugmica 
                    prikazDugmica(nizSlider);
                    
                    //Slajder SLIKE
                    const slajderObj = document.querySelector("#carouselSliderIndicators");
                    slajderSlike(slajderObj,nizSlider);
                    //Slajder DUGMICI
                    const nizSlajderDugmica = $('button[data-az-slide]');
                    slajderDugmici(nizSlajderDugmica);

                    //Prikaz top proizvoda
                    var topPro = nizProizvoda.filter(x=>x.top);
                    var divTopPro = document.querySelector("#topProizvodi");
                    prikazProizvoda(topPro,divTopPro);
                    
                    //Prikaz svih akcija (ako ih ima vise prikazace se kao odvojeni blokovi)
                    var divOdabPro = document.querySelector(".az-akcije");
                    var odabPro = nizProizvoda.filter(x=>x.cenaInfo.promocija!=null);
                    prikazProizvodaOdabrani(odabPro,divOdabPro);

                    //prikaz najnovijih proizvoda
                    var najPro = nizProizvoda.sort((a,b)=>{
                        var datPoc = new Date(a.datumIzlaska);
                        var datKraj = new Date(b.datumIzlaska);

                        if(datPoc.getTime()>datKraj.getTime()){
                            return -1;
                        }else{
                            return 1;
                        }
                    }).slice(0,4);
                    var divNajPro = document.querySelector("#najnovijiProizvodi")
                    prikazProizvoda(najPro,divNajPro);
                    dodavanjeKorpa();
                    

        
 
    }
    if(url==`${prefiksOnline}pages/proizvodi.html`){
        
                        prikazCheckBoxova(nizProizvoda);
                        $("#cistac").click(ocistiFiltere);
                        prikazProizvodaProdavnica();
                       
                        $("#chbPart input[type='checkbox']").change(prikazProizvodaProdavnica);
                        document.querySelector("#sortPro").addEventListener("change",prikazProizvodaProdavnica);
                        document.querySelector("#inputNaziv").addEventListener("keyup",prikazProizvodaProdavnica);
                        // prikazModalaArtikal();
                        // dodavanjeKorpa();
                        prikaziBrojProizvodaUKorpi();
                
    }

    
    if(url==`${prefiksOnline}pages/korpa.html`){
        prikaziBrojProizvodaUKorpi();
        // console.log(brArtikalaKorpa())
        if(!brArtikalaKorpa()){
            prikazPraznuKorpu();
        }else{
            prikazKorpe(dohvatiLS("korpa"));
        }
        const formaObj = document.querySelector("#kontaktForm");
        var inputFormObjects = formaObj.querySelectorAll(`input[type='text'],input[type='email']`);
        proveraFormeUzivo(inputFormObjects);

    }
    //Konstante za footer
    var nizFuter = await dohvatiPodatkePromise("futerLinkovi.json");
    prikazFooterInformacija();
    prikazFooterIkonica(nizFuter);
    
    strelicaPrikaz();
    setTimeout(zavrsiLoadScreen,1300);
    setTimeout(()=>$("#load-screen").remove(),2300);
};

function proveraFormeUzivo(inputFormObjects){
    const formaSelect = document.querySelector("select");
    var divCbx = document.querySelector(".form-floating.col-md-12 > .row");
    formaSelect.addEventListener('change',function(){
        let pom = Number(formaSelect.value);
        // console.log(pom);
        if(pom){
            formaSelect.previousElementSibling.classList.remove("text-danger"); 
            formaSelect.previousElementSibling.classList.add("text-success");
            formaSelect.classList.remove("az-form-border");
            
            // console.log(pom);
            // console.log(divCbx);

            if(pom==2){
                divCbx.innerHTML = ` <div class="form-floating col-md-12">
                    <input type="text" class="form-control" id="inputAdresa" placeholder="Partizanska 27"/>
                    <label for="inputAdresa" class="form-label ps-3">Adresa: <span class="text-danger"><i class="fa-regular fa-asterisk"></i></span></label>
                    <p class="az-red mt-2 mb-0 ms-1 az-invisible fw-bold"></p>
                </div><div class="form-floating col-md-12 mt-3">
                <input type="text" class="form-control" id="inputGrad" placeholder="Beograd"/>
                <label for="inputGrad" class="form-label ps-3">Grad: <span class="text-danger"><i class="fa-regular fa-asterisk"></i></span></label>
                <p class="az-red mt-2 mb-0 ms-1 az-invisible fw-bold"></p>
            </div>`;
                divCbx.classList.remove('az-invisible');
            }else{
                divCbx.innerHTML = ``;
                divCbx.classList.remove("az-invisible");
            }
         }else{
             formaSelect.previousElementSibling.classList.add("text-danger");
             formaSelect.previousElementSibling.classList.remove("text-success");
             formaSelect.classList.add("az-form-border");
             divCbx.classList.add('az-invisible');
         }
    })
    
    inputFormObjects.forEach(function(element){
        element.addEventListener('keyup',function(){
        if(!element.value.length){
            bool = false;
            element.classList.add("az-form-border");
            element.nextElementSibling.nextElementSibling.innerHTML = 'Niste popunili polje';
            element.nextElementSibling.nextElementSibling.classList.remove('az-invisible');
        }else{
            element.classList.remove("az-form-border");
            element.nextElementSibling.nextElementSibling.classList.add('az-invisible');
            proveriElem(element);
        }
        
    })});
}
function zavrsiLoadScreen(){
    $("#load-screen").addClass("az-anim-opac");
    $(bodyTag).addClass("az-body-visi");
    setTimeout(function(){$("#load-screen").addClass("az-load-del")},1150);

}
function prikazNavigacije(niz){
    let pom = ``;
    for(indeks in niz){
        if(indeks==3){
            pom+=`<li class='nav-item me-1'>
                        <a class='nav-link fs-5 px-3 py-2 position-relative' href=${prefiksOnline+(niz[indeks].href)}>
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span class="az-cart-number">0</span>
                        </a>
                    
                  </li>`;
            continue;
        }
        pom+=`<li class='nav-item me-1'>`;
        pom+=`<a class='hover-underline-animation nav-link fs-6 px-3 py-2' href="${prefiksOnline+niz[indeks].href}">${niz[indeks].name}</a>`;
        pom+="</li>";
    }
    navigacijaLink.innerHTML = pom;
}
function glavniLink(link){
    let pom = navigacijaLink.querySelectorAll(`li > a`);
    pom.forEach(function(a){
        if(prefiksPomocno!=''){
            if(a.getAttribute("href")==link){
                a.classList.add('active');
            }
        }else{
            if(a.getAttribute("href")==link){
                a.classList.add('active');
            }
        }
        
    })
}
function strelicaPrikaz(){
    document.addEventListener("scroll",function(){
        var skrolYOsa= window.scrollY;
        
        if (skrolYOsa>900){
            if(!strelicaObj.classList.contains("postaviStrelicu")){
                strelicaObj.classList.remove("skiniStrelicu");
                strelicaObj.classList.add("postaviStrelicu");   
                strelicaObj.classList.add("d-flex");
            }
        }
        else{
            if(strelicaObj.classList.contains("postaviStrelicu")){
                strelicaObj.classList.remove("postaviStrelicu");
                strelicaObj.classList.add("skiniStrelicu");
                setTimeout(() => {
                    strelicaObj.classList.remove("d-flex");
                }, 300);
            }
        }
    });

    strelicaPocetak.addEventListener("click",function(){
        window.scrollTo(0,0);
    })
}
function procitajVise($niz){
    $niz.each((i,element)=>
        $(element).click(function(){
            $(this).prev().slideToggle(600);
            if($(this).html()=='Pročitaj više')
            {
                $(this).html('Pročitaj manje');
            }
              
            else $(this).html('Pročitaj više')
        })
    );
}
function prikazFooterLinkova(niz){
    for(let i=0;i<2;i++){
        footerLink.innerHTML+=`<ul class="row my-3">
        <li class="col-6"><a href="${prefiksPomocno+niz[i].href}">${niz[i].name}</a></li>
        <li class="col-6"><a href="${prefiksPomocno+niz[i+2].href}">${niz[i+2].name}</a></li>
      </ul>`;
    }
}
function prikazFooterInformacija(){
    for(obj of footerInfoObj){
        footerInfo.innerHTML+=`<li class="my-3"><i class="fas fa-${obj.icon}"></i>${obj.txt}</li>`;
    }
}
function prikazFooterIkonica(footerIconObjects){
    for(var i=3;i<footerIconObjects.length;i++){
        footerIconObjects[i].link = prefiksPomocno +footerIconObjects[i].link;
    }
    for(element of footerIconObjects){
        footerIcons.innerHTML+=`<li><a class="az-sm d-flex justify-content-center align-items-center rounded-circle" href="${element.link}"><i class="az-white ${element.icon}"></i></a> </li>`;
    }
}
function prikazForme(inputFormObjects,labelFormObjects){
    for(let i =0;i<inputFormObjects.length;i++){
        inputFormObjects[i].addEventListener("focus",function(){
            labelFormObjects[i].innerHTML += `  (Primer: ${inputFormObjects[i].getAttribute("placeholder")})`;
        });
        inputFormObjects[i].addEventListener("blur",function(){
            labelFormObjects[i].innerHTML = labelFormObjects[i].getAttribute('for').substring(5,) + `<span class="text-danger"><i class="fa-regular fa-asterisk"></i></span>`;
        });
    }
    
}
function proveraForme(){
    var bool = true;
    let inputFormObjects = this.parentElement.parentElement.querySelectorAll("input[type='text'],input[type='email']");
    let selectFormObject = document.querySelector("select");
    let radioObj = document.kontaktForm.tipKontakt;
    inputFormObjects.forEach((element,indeks) =>{
        if(!element.value.length){
            bool = false;
            element.classList.add("az-form-border");
            element.nextElementSibling.nextElementSibling.innerHTML = 'Niste popunili polje';
            element.nextElementSibling.nextElementSibling.classList.remove('az-invisible');
        }else{
            if(!proveriElem(element))bool=false;
        }
    });

    let br = 0;
    if(selectFormObject.selectedIndex){
        selectFormObject.classList.remove("az-form-border");
        
    }else {bool = false;selectFormObject.classList.add("az-form-border");};

    if(!radioObj.value){
        radioObj[0].parentElement.parentElement.nextElementSibling.classList.remove('az-invisible');
        bool = false;
    }else {
        radioObj[0].parentElement.parentElement.nextElementSibling.classList.add('az-invisible');
        
    }
    if(bool){
        this.parentElement.parentElement.innerHTML = `<p class="fs-3 fw-bold text-success">Uspešno ste poručili artikle</p>`;
        
        setTimeout(function(){
            let $p = $("#poruciModal");
            $p.animate({opacity:"0"},300);
            setTimeout(function(){$($p).removeClass("az-visible");},300);
            $('#pozadinaModal').remove();
            localStorage.clear();
            prikazPraznuKorpu();
        },2000);

    }else{
        this.previousElementSibling.classList.add("az-red")
        this.previousElementSibling.classList.remove("text-success");
        this.previousElementSibling.innerHTML = "Niste dobro popunili formu !";
    }
    this.previousElementSibling.classList.remove("az-invisible");
}
function proveriElem(element){
    let provera = true;
    //	0XX XXXX XXX
    let regExpTel = /^(06[^7]\/[0-9]{7})|(067\/7[0-9]{6})$/;
    let regExpMejl = /^[\w\_]{3,}\@[a-z]{3,}\.[a-z]{2,3}$/;
    let regExpIme = /^([A-ZČĆŽŠĐ][a-zčćžšđ]{2,})(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{2,})*$/;
    let regExpAdresa = /^(((\d{2,4}\.?)((\s(([a-zčćžšđ]{3,}))+))+))|(([A-ZČĆŽŠĐ][a-zčćžšđ]{2,})(\s(\w+))*)$/;

            var regIme = /input(?=(Ime|Prezime|Grad))/;
            if(element.id.match(regIme)){
                provera = regExpIme.test(element.value);
            }
            if(element.id =='inputEmail' || element.id =='emailUnos'){
                provera = regExpMejl.test(element.value);
            }
            if(element.id =='inputTelefon'){
                provera = regExpTel.test(element.value);
            }
            if(element.id =='inputAdresa'){
                provera = regExpAdresa.test(element.value);
            }
            if(!provera){
                element.classList.add("az-form-border");
                element.parentElement.lastElementChild.classList.remove('az-invisible');
                element.parentElement.lastElementChild.innerHTML ='Niste popunili polje u trazenom formatu';
            }else{
                element.classList.remove("az-form-border");
                element.parentElement.lastElementChild.classList.add('az-invisible');
            }
    return provera;
}

function prikazInput(pom){
    let cuvaj = document.querySelector(".form-floating.col-md-12 > .row");
    cuvaj.innerHTML = '';

    
}

function padajuciMeni(){
    $("#btnMeni").click(function(){
        $(this).next().slideToggle();
    })
}
let brAk = 0
function slajderDugmici($pom){
    $pom.each(function(i,elem){
        let pom = i;
        $(elem).click(function(){
            clearInterval(animacija);
            var $trenutno = $(`#carouselSliderIndicators .carousel-inner .az-visible`);
            var $sledeci = $($trenutno.parent().children()[pom]);
            if(!$sledeci.hasClass('az-visible')){
            $trenutno.hide('slow').removeClass('az-visible');
            $sledeci.fadeIn().addClass("az-visible");}
            brAk = pom;
            $($($pom).find("img")).attr("src",`${prefiksOnline+prefiksSlike}/controllerSlide.png`) ;
            $($(this).find("img")).attr("src",`${prefiksOnline+prefiksSlike}/controllerSlideActive.png`) ;
            $($pom).removeClass('az-active');
            $(this).addClass('az-active');
            animacija = setInterval(slajderAnimacija,4000);
        });
    });
    
}

function slajderAnimacija(){
    var $trenutno = $(`#carouselSliderIndicators .carousel-inner .az-visible`);
    
    var $sledeci = $trenutno.next().length ? ($trenutno.next()) : ($trenutno.parent().children(":first"));
    let $trenutnoDugme = $("#carouselSliderIndicators button").filter(`button[data-az-slide = ${brAk}]`);
    let imgSrcTrt = $($trenutnoDugme).find("img");
    let $sledeceDugme = $trenutnoDugme.next().length ? ($trenutnoDugme.next()): ($trenutnoDugme.parent().children(":first"));
    let imgSrcSle = $($sledeceDugme).find("img");

    $trenutno.hide('slow').removeClass('az-visible');
    $sledeci.fadeIn().addClass("az-visible");    
    brAk = brAk<3 ? ++brAk:0;
    $trenutnoDugme.removeClass("az-active");
    $(imgSrcTrt).attr("src",`${prefiksOnline+prefiksSlike}/controllerSlide.png`) ;
    $sledeceDugme.addClass("az-active");
    $(imgSrcSle).attr("src",`${prefiksOnline+prefiksSlike}/controllerSlideActive.png`)
}
// function funkModal(){
//     let buttonObj = document.querySelectorAll('.card-body > button');
//         buttonObj.forEach(elem =>{
            
//             elem.addEventListener('click',function(){
//                 $(this).next().addClass("az-visible");
//                 $(this).next().animate({opacity:"1"},500);
//                 $('<div id="pozadinaModal" class="modal-backdrop fade show"></div>').appendTo($("body"));
//             });
//         });
//         let buttonIks = document.querySelectorAll(`.modal-header > button,.modal-footer > button`);
//         buttonIks.forEach(elem=>{
//             elem.addEventListener("click",function(){
//                 let $p = $(this).parent().parent().parent().parent();
//                 $p.animate({opacity:"0"},500);
//                 setTimeout(function(){$($p).removeClass("az-visible");},500);
//                 $('#pozadinaModal').remove();
//             })
//         })
// }
function crtanjeModala(obj){
    $(obj).addClass("az-visible");
    $(obj).animate({opacity:"1"},300);
    // console.log(1);
    $('<div id="pozadinaModal" class="modal-backdrop fade show"></div>').appendTo($("body"));

    $($(obj).find(".btn-close,.btn-secondary")).click(function(){
        let $p = $(this).parent().parent().parent().parent();
        $p.animate({opacity:"0"},300);
        setTimeout(function(){$($p).removeClass("az-visible");},300);
        $('#pozadinaModal').remove();
    })
    $("#dugmeProvera").click(proveraForme);
    
}

function brisiPoruke(pom){
    pom.showErrors({
        inputIme:"",
        inputEmail:"",
        inputPrezime:"",
        txtOblast:"Morate ostaviti poruku koju prosleđujete!"
      })
}
function prikazImenaStrane(){
    var prikazStrane = document.querySelectorAll("#naslovna span");
    prikazStrane.forEach(function(elem){
        elem.innerText=url.substring(url.lastIndexOf('/')+1,url.lastIndexOf(".")).toLowerCase();
    });
}
function slajderSlike(slajderObj,niz){
    for(let i=0;i<niz.length;i++){
        var divObj = document.createElement("div");
        divObj.classList.add('carousel-item');
        if (!i) {divObj.classList.add('az-visible')};
        divObj.innerHTML =`<img src='${prefiksSlike+niz[i].slika.src}' class="d-block w-100 mx-auto" alt="${niz[i].slika.alt}"/>`;
        slajderObj.lastElementChild.appendChild(divObj);
    } 
}
function prikazDugmica(niz){
    var div = document.querySelector("#carouselSliderIndicators div");
    let ispis = `<button type="button"  data-az-slide="0" class="az-active me-2" >
                    <img src="${prefiksSlike}controllerSlideActive.png" />
                </button>`;
    let pom = "";
    for(let i=1;i<niz.length;i++){
        if(i<niz.length-1)pom="me-2";
        else pom="";
        ispis+=`<button type="button"  data-az-slide="${i}" class="az-active ${pom}" >
                    <img src="${prefiksSlike}controllerSlide.png" />
                </button>`
    }
    div.innerHTML = ispis;
}
function prikazProizvoda(proizvodi,obj){
    let ispis = ``;
    for(var it of proizvodi){
        ispis+=`<div class="col-lg-3 col-sm-6 col-12 mb-5 az-opac-0">
                    <div class="card rounded-3 text-center">
                        <a class="az-btn-modal" data-id="${it.id}"><img class="card-img-top" src="${prefiksOnline+it.slika.src}" alt="${it.slika.alt}" /></a>
                        <div class="card-body">
                            <div class="az-head-h">
                                <a class="az-btn-modal" data-id="${it.id}"><h5 class="card-title fw-bold">${it.naziv}</h5></a>
                                <a href="${nizProizvodjaca.filter(x=>x.id==it.proizvodjac)[0].href}" target="_blank"><small class="text-primary fw-bold">${nizProizvodjaca.filter(x=>x.id==it.proizvodjac)[0].naziv}</small></a>
                            </div>
                            <hr class="az-hr w-50 my-3"/>
                            <p class="card-text">
                                ${it.cenaInfo.cenaNova!=null?`<span class="az-old-cena text-warning fw-bold ">${it.cenaInfo.cenaStara} RSD</span><br/><span class="az-new-cena fs-4">${it.cenaInfo.cenaNova} RSD</span> `:`<br/><span class="az-new-cena fs-4">${it.cenaInfo.cenaStara} RSD</span>`}
                            </p>
                        </div>
                        <button class="btn btn-warning w-100 az-btn-pro rounded-0 rounded-bottom fs-5 az-btn-korpa" data-id="${it.id}">Dodaj u korpu <i class="fa-solid fa-cart-shopping"></i></button>
                    </div>
                </div>`;
    }
    obj.innerHTML = ispis;
    let arr = Array.from(obj.children);
    prikazOpacity(arr);
    prikazModalaArtikal();    
}
function prikazOpacity(arr){
    arr.forEach((elem,indeks)=>{
        setTimeout(function(){
            elem.classList.add("az-opacity");
            elem.classList.remove("az-opac-0");
        },indeks*100);
    });
}
function prikazProizvodaOdabrani(proizvodi,obj){
    var promocije = [];
    proizvodi.forEach(x=>{!promocije.includes(x.cenaInfo.promocija)?promocije.push(x.cenaInfo.promocija):''});
    obj.innerHTML = '';

    for(var it of promocije){
        // console.log(nizPromocije);
        let objPromocija = nizPromocije.filter(x=>x.id==it)[0];
        // console.log(objPromocija.naziv.split(" ")[0]);
        let ispis = `<div class="row flex-wrap">
        <div class="col-12 my-5 text-center">
            <h2 class="fs-1"><i class="fa-solid fa-percent text-warning"></i> ${objPromocija.naziv} <i class="fa-solid fa-percent text-warning"></i></h2>
            <hr class="az-hr"/>
        </div>
        <div class="col-12">
          <div id="${objPromocija.naziv.split(" ")[0]}Akcija" class="row">
            <div class="col-12">
              <div class="row my-5">
                <div class="col-xl-5 col-md-10 col-12 mx-auto">
                  <a>
                    <img class="img-fluid" src="${prefiksPomocno+objPromocija.slika.src}" alt="${objPromocija.slika.alt}" />
                  </a>
                </div>
                <div class="col-xl-7 col-md-10 col-12 mx-auto mt-xl-0 mt-5  text-center d-flex flex-column justify-content-center">
                    <p>${objPromocija.opis}</p>
                    <p class="fs-5 fw-bold">PONUDA VAŽI JOŠ</p>
                    <div class="row ">
                        <div class=" col-md-8 col-12 mx-auto">
                            <div class="row justify-content-center">
                                <div class="col-xxl-2 col-3">
                                    <span class="d-flex flex-column justify-content-center align-items-center">
                                        <span data-timername="dan" class="az-box-timer fw-bold">10</span>
                                        <span >Dani</span>
                                    </span>
                                </div>
                                <div class="col-xxl-2 col-3">
                                  <span class="d-flex flex-column justify-content-center align-items-center">
                                      <span data-timername="sat" class="az-box-timer fw-bold">10</span>
                                      <span >Sati</span>
                                  </span>
                              </div>
                              <div class="col-xxl-2 col-3">
                                <span class="d-flex flex-column justify-content-center align-items-center">
                                    <span data-timername="min" class="az-box-timer fw-bold">10</span>
                                    <span >Minuti</span>
                                </span>
                            </div>
                            <div class="col-xxl-2 col-3">
                              <span class="d-flex flex-column justify-content-center align-items-center">
                                  <span data-timername="sek" class="az-box-timer fw-bold">10</span>
                                  <span >Sekundi</span>
                              </span>
                          </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div> 
            <div id="odabraniProizvodi${objPromocija.naziv.split(" ")[0]}" class="col-lg-8 col-sm-12 col-10 mx-auto text-center">
                <div   class="row">
                </div>
            </div>
            </div>
            </div></div>`
        obj.innerHTML += ispis;
        let datKraj = new Date(objPromocija.datumKraj);
        let timerObj = document.querySelectorAll(`#${objPromocija.naziv.split(" ")[0]}Akcija .az-box-timer`);
        timerAction(datKraj,timerObj);

    
        ispis = `<h3 class="col-12 text-center">Odabrani proizvodi<br/><i class="fa-solid fa-arrow-down fs-1"></i></h3>`;
        let nizId =[];
        let nizPro = [];
        let objects = obj.querySelector(`#odabraniProizvodi${objPromocija.naziv.split(" ")[0]} .row`);
        let nizObj = proizvodi.filter(x=>x.cenaInfo.promocija==it);
        for(let i=0;i<4;i++){
            let br = Math.floor(Math.random()*nizObj.length);
            if(!nizId.includes(br)){
                nizId.push(br);
                nizPro.push(proizvodi[br]);  
            }else{
                if(i>=nizObj.length) break;
                i--;
                continue;
            }
                  
        }
        // prikazProizvoda(nizPro,objects);
        prikazProizvoda(nizPro,objects);
        
        objects.innerHTML = ispis + objects.innerHTML ;
        objects.parentElement.innerHTML = objects.parentElement.innerHTML + `<a href="pages/proizvodi.html" class="btn btn-warning az-w-btn mx-auto my-5 az-btn-pro rounded-0 rounded-bottom fs-5">Pogledaj celu ponudu <i class="fa-solid fa-arrow-right"></i></a>`;
    }

    let arr = Array.from(obj.querySelectorAll(".az-opac-0"));
    prikazOpacity(arr);
}
function timerAction(datKraj,obj){
    var nizTimerBox = obj;
    var datSada = new Date();
    let br = datKraj-datSada;
    var dani = Math.floor(br / (1000 * 60 * 60 * 24));
    var sati = Math.floor((br % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minuti = Math.floor((br % (1000 * 60 * 60)) / (1000 * 60));
    var sekundi = Math.floor((br % (1000 * 60)) / 1000);
    nizTimerBox.forEach(elem => {
        let naziv = $(elem).data("timername");
        
        if(naziv=='dan'){
            elem.innerHTML=dani;
        }else if(naziv=="sat"){
            elem.innerHTML=sati;
        }else if(naziv=="min"){
            elem.innerHTML=minuti;
        }else if(naziv=="sek"){
            elem.innerHTML=sekundi;
        }
    });

    setTimeout(function(){
        timerAction(datKraj,obj);
    },1000)
}

function proveraNewsletter(event){
    event.preventDefault();
    if(proveriElem(document.querySelector("#emailUnos"))){
        document.querySelector("#emailUnos").parentElement.lastElementChild.classList.remove("text-danger","az-invisible");
        document.querySelector("#emailUnos").parentElement.lastElementChild.classList.add("text-success");
        document.querySelector("#emailUnos").parentElement.lastElementChild.innerHTML = "Uspesno ste se prijavili";

        setTimeout(function(){
            document.querySelector("#emailUnos").value='';
            document.querySelector("#emailUnos").parentElement.lastElementChild.classList.add("az-invisible");
            document.querySelector("#emailUnos").parentElement.lastElementChild.classList.remove("text-success");
        },2000)
    }else{
        document.querySelector("#emailUnos").parentElement.lastElementChild.classList.add("text-danger");
    }
        
}
function sortiranjeProizvoda(niz){
    var select =document.querySelector("#sortPro");
    return niz.sort((a,b)=>{
        if(select.value=='0'){
            return a.id-b.id;
        }
        if(select.value=="nazivAsc"){
            if(a.naziv > b.naziv){
                return 1;
            }else if (a.naziv<b.naziv) return -1;
            else return 0;
        }
        if(select.value=="nazivDesc"){
            if(a.naziv > b.naziv){
                return -1;
            }else if (a.naziv<b.naziv) return 1;
            else return 0;
        }
        if(select.value=='cenaAsc'){
            if(a.cenaInfo.cenaNova!=null){
                if(b.cenaInfo.cenaNova!=null){
                    return a.cenaInfo.cenaNova-b.cenaInfo.cenaNova;
                }else{
                    return a.cenaInfo.cenaNova-b.cenaInfo.cenaStara;
                }
            }else{
                if(b.cenaInfo.cenaNova!=null){
                    return a.cenaInfo.cenaStara-b.cenaInfo.cenaNova;
                }else{
                    return a.cenaInfo.cenaStara-b.cenaInfo.cenaStara;
                }
                
            }
        }
        if(select.value=='cenaDesc'){
            if(a.cenaInfo.cenaNova!=null){
                if(b.cenaInfo.cenaNova!=null){
                    return b.cenaInfo.cenaNova-a.cenaInfo.cenaNova;
                }else{
                    return b.cenaInfo.cenaStara-a.cenaInfo.cenaNova;
                }
            }else{
                if(b.cenaInfo.cenaNova!=null){
                    return b.cenaInfo.cenaNova-a.cenaInfo.cenaStara;
                }else{
                    return b.cenaInfo.cenaStara-a.cenaInfo.cenaStara;
                }
                
            }
        }
        if(select.value=='datAsc'){
            dat1 = new Date(a.datumIzlaska);
            dat2 = new Date(b.datumIzlaska);

            return dat1-dat2;
        }
        if(select.value=='datDesc'){
            dat1 = new Date(a.datumIzlaska);
            dat2 = new Date(b.datumIzlaska);
            return dat2-dat1;
        }
    })
}

function filtriranje(niz, tip){
    if(tip=="pretraga"){
        let vrednost = document.querySelector("#inputNaziv").value.trim().toLowerCase();
        if(vrednost!='')
            niz=niz.filter(x=>x.naziv.toLowerCase().includes(vrednost)||x.sifra.toLowerCase().includes(vrednost));
    }
    if(tip=="chbProizvođači"||tip=="chbPegi"){
        let nizSel = [];
        $(`#${tip} input[type=checkbox]:checked`).each(function(e,x){nizSel.push(Number(x.value))});
        if(nizSel.length){
            if(tip=="chbPegi"){
                niz = niz.filter(x=>nizSel.includes(x.pegiOznaka));
            }else{
                niz = niz.filter(x=>nizSel.includes(x.proizvodjac));
            }
            
        }
    }
    if(tip=="chbPlatforme" || tip=="chbŽanrovi"){
        let nizSel = [];
        $(`#${tip} input[type=checkbox]:checked`).each(function(e,x){nizSel.push(Number(x.value))});
        if(nizSel.length>1){
            const provera = (a, b) =>
                a.length == b.length &&
                a.every(x=>b.includes(x))
            ;
            if(tip=="chbPlatforme"){
                niz=niz.filter(x=>provera(nizSel,x.platforme));
                // console.log(nizSel);
                
            }else if (tip==`chbŽanrovi`) {
                niz=niz.filter(x=>provera(nizSel,x.zanrovi));
            }
        }else if(nizSel.length==1){
            if(tip=="chbPlatforme"){
                niz=niz.filter(x=>x.platforme.includes(nizSel[0]));
            }else if (tip==`chbŽanrovi`) {
                niz=niz.filter(x=>x.zanrovi.includes(nizSel[0]));
        }
    }}
    
    return niz;
}

function prikazProizvodaProdavnica(){
    var divBlokPro = document.querySelector("#proizvodiBlok");
    var spanBr = document.querySelector("#brPri");
    var spanUkupno = document.querySelector("#brPro");

    let proizvodi = [];
    proizvodi = filtriranje(nizProizvoda,"pretraga");
    proizvodi = filtriranje(proizvodi,"chbProizvođači");
    proizvodi = filtriranje(proizvodi,"chbPlatforme");
    proizvodi = filtriranje(proizvodi,"chbPegi");
    proizvodi = filtriranje(proizvodi,"chbŽanrovi");
    proizvodi = sortiranjeProizvoda(proizvodi);

    if(proizvodi.length){
        prikaziBrChb(proizvodi);
        prikazProizvoda(proizvodi,divBlokPro);
        dodavanjeKorpa();
        prikaziBrojProizvodaUKorpi();
    }else{
        divBlokPro.innerHTML = `<div class="col-10 mx-auto my-5 py-5 alert alert-warning text-center rounded-3"><p class="fs-2 fw-bold">Nema proizvoda koji ispunjavaju sve parametre !!!</p></div>`
    }

    spanBr.innerHTML=proizvodi.length;
    spanUkupno.innerHTML = nizProizvoda.length;
    
}
function prikaziBrChb(proizvodi){
    let nizNaslova = ["Proizvođači","Platforme","Pegi","Žanrovi"];
    for(var it of nizNaslova){
        let divObj = $(`#chb${it} span`);
        divObj.each((e,elem)=>{
            if(it=="Proizvođači"){
                elem.innerHTML = `(${proizvodi.filter(x=>x.proizvodjac==$(elem).data("id")).length})`;
            }
            if(it=="Platforme"){
                elem.innerHTML = `(${proizvodi.filter(x=>x.platforme.includes($(elem).data("id"))).length})`;
            }
            if(it=="Pegi"){
                elem.innerHTML = `(${proizvodi.filter(x=>x.pegiOznaka==($(elem).data("id"))).length})`;
            }
            if(it=="Žanrovi"){
                elem.innerHTML = `(${proizvodi.filter(x=>x.zanrovi.includes($(elem).data("id"))).length})`;
            }

        })
        
    }
}
function prikazCheckBoxova(proizvodi){
    let ispis = '';
    let obj = document.querySelector("#chbPart");

    let nizNaslova = ["Proizvođači","Platforme","Pegi Oznaka","Žanrovi"];

    let odabProizvodjaci = nizProizvodjaca;
    let odabPlatforme = nizPlatformi;
    let odabPegi = nizPegiOznaka;
    let odabZanrovi = nizZanrova;

    var nizSvih =[odabProizvodjaci,odabPlatforme,odabPegi,odabZanrovi];
    for(var i in nizSvih){
        ispis+=`<div class="col-lg-12 col-6"><h3 class="my-3 text-center fw-bold">${nizNaslova[i]}</h3>
        <div id="chb${nizNaslova[i].split(' ')[0]}">`
        for(let it of nizSvih[i]){
            ispis+=`<div class="form-check">
                        <input class="form-check-input" type="checkbox" name="chb${nizNaslova[i].split(' ')[0]}" value="${it.id}" id="chb${nizNaslova[i].split(' ')[0]}${it.id}" />
                        <label class="form-check-label ms-3" for="chb${nizNaslova[i].split(' ')[0]}${it}">
                        ${it.naziv}<span class="fw-bold ms-2 ${nizNaslova[i].split(' ')[0]}" data-id="${it.id}">(${proizvodi.filter(x=>x.proizvodjac==it).length})</span>
                    </label>
                    </div>`;
                    
        }           
        ispis+=` </div></div>`; 
        
    }
    ispis+=`<button id='cistac' class="btn btn-warning w-100 az-btn-pro rounded-0 my-5 rounded-bottom fs-5" >Očisti filtere <i class="fa-solid fa-x"></i></button>`;
    
    obj.innerHTML=ispis;

}
function ocistiFiltere(){
    document.querySelectorAll("#chbPart input[type='checkbox']").forEach((elem)=>elem.checked=false);
    document.querySelector("#inputNaziv").value='';
    document.querySelector("#sortPro").selectedIndex=0;
    
    prikazProizvodaProdavnica();
}
 async function proizovodi(){
    nizProizvoda = await dohvatiPodatkePromise("proizvodi.json");
    nizProizvodjaca = await dohvatiPodatkePromise("proizvodjaci.json");
    nizPegiOznaka = await dohvatiPodatkePromise("pegi.json");
    nizPlatformi = await dohvatiPodatkePromise("platforme.json");
    nizZanrova = await dohvatiPodatkePromise("zanrovi.json");
    nizPromocije = await dohvatiPodatkePromise("promocije.json");
}

function datumPrikaz(dat){
    return `${dat.getDate()}.${dat.getMonth()+1}.${dat.getFullYear()}`;
}

function prikazModalaArtikal(){
    $(".az-btn-modal").click(function(e){
        let obj = document.querySelector("#proizvodModal");
        obj.querySelector("#trajanjeAkcije").innerHTML ='';
        id = $(e.currentTarget).data("id");
        let it = nizProizvoda.filter(x=>x.id==id)[0];
        obj.querySelector(".modal-header p").innerHTML = nizProizvodjaca.filter(x=>x.id==it.proizvodjac)[0].naziv;
        obj.querySelector(".modal-title").innerHTML = it.naziv;
        obj.querySelector(".modal-body img:nth-child(1)").src = prefiksPomocno+it.slika.src;
        obj.querySelector(".modal-body img:nth-child(1)").alt = prefiksPomocno+it.slika.alt;
        obj.querySelector(".modal-body img:nth-child(2)").src = prefiksPomocno+nizPegiOznaka.filter(x=>x.id==it.pegiOznaka)[0].slika.src;
        obj.querySelector(".modal-body img:nth-child(2)").alt = prefiksPomocno+nizPegiOznaka.filter(x=>x.id==it.pegiOznaka)[0].slika.alt;
        obj.querySelector(".modal-body p.card-text").innerHTML=`${it.cenaInfo.cenaNova!=null?`<span class="az-old-cena text-warning fw-bold me-2">${it.cenaInfo.cenaStara} RSD</span><span class="az-new-cena fs-4">${it.cenaInfo.cenaNova} RSD</span> `:`<span class="az-new-cena fs-4">${it.cenaInfo.cenaStara} RSD</span>`}`;
        if(it.cenaInfo.cenaNova!=null){
            let promocija =nizPromocije.filter(x=>x.id==it.cenaInfo.promocija)[0];
            obj.querySelector("#trajanjeAkcije").innerHTML = `<p class="alert alert-info">${promocija.naziv} na kojoj se nalazi ovaj proizvod traje od ${datumPrikaz(new Date(promocija.datumPoc))} do ${datumPrikaz(new Date(promocija.datumKraj))}</p>`;
        }
        obj.querySelector(".modal-footer p small").innerHTML =`${datumPrikaz(new Date(it.datumIzlaska))}`;
        obj.querySelector(".modal-body #zanrovi").innerHTML = (nizZanrova.filter(x=>it.zanrovi.includes(x.id)).map(x=>x.naziv)).join("/");
        obj.querySelector(".modal-body #opis").innerHTML = it.opis;
        obj.querySelector(".modal-body #sifra").innerHTML = it.sifra;
        
        obj.querySelector(".modal-body #platforme").innerHTML = (nizPlatformi.filter(x=>it.platforme.includes(x.id)).map(x=>x.naziv)).join("/");
        crtanjeModala(obj);
    })
}

function postaviLS(naziv,podaci){
    localStorage.setItem(naziv,JSON.stringify(podaci));
}
function dohvatiLS(naziv){
    return JSON.parse(localStorage.getItem(naziv));
}

function brArtikalaKorpa(){
    return JSON.parse(localStorage.getItem("korpa"))==null?0:JSON.parse(localStorage.getItem("korpa")).length
}

function prikaziBrojProizvodaUKorpi(){
    document.querySelector(".az-cart-number").innerHTML = brArtikalaKorpa();
}

function dodavanjeKorpa(){
    $(".az-btn-korpa").click(function(){
        // console.log("RADI" + this.dataset.id);
        upisProizvoda(this.dataset.id);
    })
}

function upisProizvoda(id){
    let proizvodiKorpa = dohvatiLS("korpa");
    let proveraKorpe =0;
    if(proizvodiKorpa!=null) proveraKorpe=proizvodiKorpa.filter(x=>x.id==id).length;

    if(proizvodiKorpa!=null){
        if(proveraKorpe>0){
            azurirajKolicinu(id,proizvodiKorpa);
        }else{
            proizvodDodajKorpa(id,proizvodiKorpa);
            prikaziBrojProizvodaUKorpi();
        }
    }else{
        proizvodDodajKorpa(id,[]);
        prikaziBrojProizvodaUKorpi();
    }
    prikazDodato();
}

function azurirajKolicinu(id,proizvodi){
    for(el of proizvodi){
        if(el.id==id) {
            el.qty++;
            break;
        }
    }

    postaviLS("korpa",proizvodi);
}


function proizvodDodajKorpa(id,proizvodi){
    let jedanProizvod = nizProizvoda.filter(x=>x.id==id)[0];
    proizvodi.push({
        id:jedanProizvod.id,
        naziv:jedanProizvod.naziv,
        cenaInfo:jedanProizvod.cenaInfo,
        sifra:jedanProizvod.sifra,
        slika:jedanProizvod.slika,
        qty:1
    })

    postaviLS("korpa",proizvodi);
}
function prikazDodato(){
    divObj = document.querySelector("#korpaAlert");
    korpaAlert.classList.remove("d-none");
    korpaAlert.classList.add("az-opacity");
    korpaAlert.classList.remove("az-opac-0");
    setTimeout(function(){
        korpaAlert.classList.remove("az-opacity");
        korpaAlert.classList.add("az-opac-0");
        setTimeout(()=>korpaAlert.classList.add("d-none"),500);
    },1300);
}
function prikazPraznuKorpu(){
    document.querySelector("#korpaIspis").innerHTML=`<p class="text-center fs-5">Trenutno nema artikala u korpi</p>
    <a href="../pages/proizvodi.html" class="btn btn-warning w-25 mx-auto az-btn-pro">Pogledaj ponudu<i class="fa-solid fa-store ms-2"></i></a>`
    prikaziBrojProizvodaUKorpi();
}
function prikazKorpe(niz){
    let ispis = '';
    ispis = `
    <div class="table-responsive-xl">
        <table class="table w-75 mx-auto text-center">
        <thead>
        <tr class="table-dark border-botom">
          <th scope="col" class="az-orange">#</th>
          <th scope="col" class="az-orange">Proizvod</th>
          <th scope="col" class="az-orange">Naziv</th>
          <th scope="col" class="az-orange">Sifra proizvoda</th>
          <th scope="col" class="az-orange">Jedinična cena</th>
          <th scope="col" class="az-orange">Količina</th>
          <th scope="col" class="az-orange">Ukupna cena</th>
          <th scope="col" class="az-orange">Obriši</th>
        </tr>
        </thead>
        <tbody>
        `;
    let suma=0;
    niz.forEach((el,indeks)=>{ispis+=prikaziProizvodKorpa(el,indeks+1);suma+=el.qty*cenaProizvoda(el)});
    ispis+=`<tr class="fs-5 fw-bold table-warning">
                <td colspan="5">Ukupna cena svih artikala je :</td>
                <td colspan="3">${suma.toLocaleString()} RSD</td>
            </tr>`
    document.querySelector("#korpaIspis").innerHTML = `${ispis}</tbody></table>
    </div>
    ${Number(suma)>=3000?`<div class="alert w-50 bg-warning mx-auto text-center py-2" >
    <p class="fw-bold my-2">Besplatna isporuka <i class="fa-solid fa-truck ms-2 fs-3 az-valign"></i></p>
  </div>`:`<div class="alert w-50 bg-danger mx-auto text-center py-2" >
  <p class="fw-bold my-2 az-white">Isporuka nije besplatna <i class="fa-solid fa-truck ms-2 fs-3 az-valign az-white"></i></p>
</div>`}
    <div class="row w-75 mx-auto my-5">
        <div class="offset-lg-6 col-lg-6 col-12 text-end">
            <button type='button' id="btnPoruci" class="btn-lg az-btn-pro btn-warning fw-bold">Poruči <i class="fa-solid fa-cart-shopping ms-2"></i></button>
            <button type='button' id="btnOtkazi" class="btn-lg az-btn-pro btn-danger">Otkaži</button>
        </div>
    </div>`
    $("table .az-btn-pro").click(function(){
        brisanjeLS($(this).data("id"));
    })
    $("input[type=number]").bind("blur change",function(){
        // console.log(this.value);

        if(Number(this.value)>0){
            pro = dohvatiLS("korpa");
            pro.filter(x=>x.id==Number(this.id.substring(8)))[0].qty=this.value
            postaviLS("korpa",pro);
            prikazKorpe(pro)
        }
        if(Number(this.value==0)) {
            brisanjeLS(this.id.substring(8))
        }
        if(this.value<0){
            this.value =1;
            prikazKorpe(dohvatiLS("korpa"))
        }
        
    })
    document.querySelector("#btnOtkazi").addEventListener("click",function(){
        localStorage.clear();
        prikazPraznuKorpu();
    })
    document.querySelector("#btnPoruci").addEventListener("click",prikazModalaPoruci);
    prikaziBrojProizvodaUKorpi();
    
}

function prikaziProizvodKorpa(el,indeks){
    let ispis ="";
    let proizvod = dohvatiLS("korpa").filter(x=>x.id==el.id)[0];
    ispis =`<tr>
        <td class="align-middle">${indeks}</td>
        <td class='align-middle az-w-15'><img class="img-fluid" alt="${proizvod.slika.alt}" src="${prefiksPomocno+proizvod.slika.src}" /></td>
        <td class='align-middle fw-bold fs-4 '>${proizvod.naziv}</td>
        <td class='align-middle fw-bold '>${proizvod.sifra}</td>
        <td class='align-middle fs-6'>${!cenaStaraProizvoda(proizvod)?`<s class="text-danger">${proizvod.cenaInfo.cenaStara} RSD</s></br>`:``}${cenaProizvoda(proizvod)} RSD</td>
        <td class='align-middle '><input type="number" class="form-control w-75 mx-auto" min="1" step="1" max="100" name="proizvod${proizvod.id}" id="proizvod${proizvod.id}" value="${proizvod.qty}" /></div></td>
        <td class="align-middle fw-bold fs-4">${proizvod.qty*cenaProizvoda(proizvod)} RSD</td>
        <td class="align-middle"><button type='button' class="btn az-btn-pro btn-warning" data-id="${proizvod.id}">Obrisi</button></td>
        </tr>
    `

    return ispis;
}
function cenaProizvoda(proizvod){
    return proizvod.cenaInfo.cenaNova==null?proizvod.cenaInfo.cenaStara:proizvod.cenaInfo.cenaNova
}
function cenaStaraProizvoda(proizvod){
    return proizvod.cenaInfo.cenaNova==null;
}

function brisanjeLS(id){
    igre = dohvatiLS("korpa");
    igre.filter(x=>x.id==id)[0].qty=0;
    pro = igre.filter(x=>x.qty>0);
    if(!pro.length) {
        localStorage.removeItem("korpa"); 
        prikazPraznuKorpu();
        
    }
    else {
        postaviLS("korpa",pro);prikazKorpe(pro);
    }
}

function prikazModalaPoruci(){
    let obj = document.querySelector("#poruciModal");
    let datumIsporuke = new Date();
    datumIsporuke.setTime(datumIsporuke.getTime()+86400000*2);
    obj.querySelector("small").innerHTML = `${datumPrikaz(datumIsporuke)}`;


    crtanjeModala(obj);
}

