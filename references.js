'use strict';
(function(){
 var REFS_HTML =
  '<div class="card" id="references" style="margin-top:28px">'+
   '<p class="eyebrow">Sources</p>'+
   '<h3>References</h3>'+
   '<ul style="list-style:none;padding:0;margin:12px 0 0;line-height:1.6">'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Centers for Disease Control and Prevention. (2024, October 4). <em>Coronavirus disease 2019 (COVID-19)</em>. '+
     'https://www.cdc.gov/covid/index.html</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Louten, J. (2016). Virus structure and classification. In <em>Essential human virology</em> (pp. 19–29). '+
     'Academic Press. https://doi.org/10.1016/B978-0-12-800947-5.00002-8</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'National Human Genome Research Institute. (2026, November 6). <em>Cell membrane (plasma membrane)</em>. '+
     'Genetics Glossary. https://www.genome.gov/genetics-glossary/Cell-Membrane-Plasma-Membrane</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Oh, J., &amp; Klivans, L. (2020, May 5). <em>How the coronavirus attacks your lungs</em>. KQED. '+
     'https://www.kqed.org/science/1963200/how-covid-19-attacks-your-lungs</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Brown, J. (2026). <em>Cells: Cytoplasm</em> [Unpublished lecture notes]. '+
     'Vertebrate Histology: BIOC21, University of Toronto Scarborough.</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Centers for Disease Control and Prevention. (2020, June 25). <em>CDC updates, expands list of people at risk of severe COVID-19</em> [News release]. '+
     'https://archive.cdc.gov/www_cdc_gov/media/releases/2020/p0625-update-expands-covid-19.html</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Kulshreshth, A., et al. (2022). COVID-19 therapy: What works? What doesn’t? And what’s on the horizon? <em>The Journal of Family Practice, 71</em>(7), E3–E16. '+
     'https://doi.org/10.12788/jfp.0474</li>'+
    '<li style="padding-left:2em;text-indent:-2em;margin-bottom:12px">'+
     'Press Herald. (2020, December 11). <em>First coronavirus vaccine receives FDA emergency use authorization</em> [News article]. '+
     'https://www.pressherald.com/?p=5771447</li>'+
   '</ul>'+
  '</div>';

 var _renderAlbum = renderAlbum;
 renderAlbum = function(){
  _renderAlbum();
  var body = document.querySelector('#main .body');
  if (body) body.insertAdjacentHTML('beforeend', REFS_HTML);
 };
})();