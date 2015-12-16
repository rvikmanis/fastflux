var cheerio = require('cheerio');

exports.onHandleHTML = function(ev) {
  if (ev.data.html[0] !== "<") return;

  var $ = cheerio.load(ev.data.html);

  $("header").prepend($("<a href='./index.html' class='branding'>Fastflux</a>"));

  $("link[href='css/prettify-tomorrow.css']").remove();
  $("script[src='script/prettify/prettify.js']").remove();
  $("script[src='script/pretty-print.js']").remove();

  $("code.source-code.prettyprint").each(function() {
    var $pcode = $(this).parent();
    $pcode.text($(this).text());
  });

  $("code[data-ice='exampleCode']").addClass('language-js');
  $("code[data-ice='importPathCode']").addClass('language-js');

  $("pre > code").each(function() {
    var cls = $(this).attr("class");
    if (typeof cls === "string" && cls.includes("language-")) {
      return;
    }
    $(this).addClass('language-js');
  });

  $("pre.source-code.line-number.raw-source-code")
    .removeClass("source-code")
    .removeClass('raw-source-code')
    .removeClass('line-number')
    .addClass('line-numbers')
    .children('code')
      .removeClass('prettyprint')
      .removeClass('linenums')
      .addClass('language-js');

  var prismJs = $("script[data-ice='userScript'][src='user/script/0-prism.js']");
  prismJs.remove();

  $("body").append(prismJs);

  ev.data.html = $.html();
};
