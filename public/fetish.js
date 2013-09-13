(function() {

  var config = {
    boxes:10,
    colors:[
      "#FFFFFF", "#C5101A", "#ED1C24", "#F78C92",
      "#E1D600", "#FFF42D", "#FFF977", "#1C9340",
      "#28D05A", "#5CE084", "#A7EFBC"
    ],
    fetishList : [
      "Lolicon", "Lactation", "Blond Hair",
      "Guro", "Giantess", "Dark Hair",
      "Christmas Cake", "Masochism", "Group Sex",
      "Crippled Girls", "Sadism", "Bondage",
      "Tsundere", "Armpits", "Yuri",
      "Kuudere", "Magical Girls", "Yaoi",
      "Yandere", "Bishounen", "Sluts",
      "Yangire", "Genki Girls", "Pure Girls",
      "Dandere", "Short Hair", "Glasses",
      "Monster Girls", "Long Hair", "Pregnant Girls",
      "Catgirls", "Asses", "Anal",
      "Muscle Girls", "Cumming Inside", "Shotacon",
      "Tattos", "Cumming Outside", "Mazaakon",
      "Hand Holding", "Blowjobs", "Big Tits",
      "Cuckold", "Body Hair", "Flat Chests",
      "Piss", "Toddlercon", "Traps", "Scat",
      "Rape", "Reverse Traps", "True Love",
      "Exhibitionism", "Tomboys", "Ahoge",
      "Murder", "Vore", "Stuttering", "Feet",
      "Dolls", "Drug Users", "Inflation",
      "Kigurimi", "Chuuni Girls", "Maids",
      "Torture", "Pain", "The Fang",
      "Dry Humping", "Kansai Accent", "Dark Skin",
      "Unusual Clothing", "Robots", "3DPD", "Futa", "Netorare",
      "Tickling"
    ],
    fetishMap:{}
  }

  var hashState = function() {
    this.fetish = []
  }
  hashState.prototype.setRank = function(val, rank) {
    this.fetish[config.fetishMap[val]] = rank;
    location.replace("#"+this.generateHash());
    $(".image-link").attr("href", "/"+this.generateHash()+".png")
  }
  hashState.prototype.getRank = function(val) {
    return this.fetish[config.fetishMap[val]];
  }
  hashState.prototype.generateHash = function() {
    var out = "";
    var fz = this.fetish;
    while (fz.length > 0) {
      var shorts = _.first(fz, 2);
      if (shorts.length == 1) {
        shorts.push(15);
      }
      var s = (shorts[0] << 4) + shorts[1]
      out = out+String.fromCharCode(s)

      fz = _.rest(fz, 2)
    }
    return window.btoa(out);
  };
  hashState.prototype.fromHash = function(hash) {
    var data = window.atob(hash)
    for (var i=0; i < data.length; i++) {
      var high = data.charCodeAt(i) >> 4
      var low = data.charCodeAt(i) & 0x00000F
      this.fetish[i*2] = high
      if (low != 15) {
        this.fetish[i*2+1] = low
      }
    }
  }

  window.state = config.state = new hashState();


  _.each(config.fetishList, function(val, i) {
    config.fetishMap[val] = i;
    config.state.fetish.push(0);
  })

  if (location.hash != "") {
    config.state.fromHash(location.hash.substring(1))
  }

  config.fetishList.sort()

  var render = function(state) {
    $(".app").empty();
    state = typeof state !== "undefined" && state !== null ? state : false;
    var noRows = Math.ceil(config.fetishList.length / 3)
    var listOrder = [];
    _.each(config.fetishList, function(val, idx) {
      listOrder[(idx % noRows)*3 + Math.floor(idx/noRows)] = val;
    })
    //listOrder = _.groupBy(listOrder, function(val, idx){ return Math.floor(idx/3); });
    //var listOrderKeys = _.keys(listOrder);
    //listOrderKeys.sort(function(a,b) { return a-b });
    var rows = [];
    while (listOrder.length > 0) {
      var row = _.first(listOrder, 3)
      var rowHtml = $("<div class=\"row\"></div>");
      _.each(row, function(val) {
        var leftCell = $("<div class=\"span2 fname\">"+val+"</div>")
        var rank = state.getRank(val)
        var rightCell = $("<div class=\"span2 rank\" data-rank=\""+rank+"\" data-val=\""+val+"\">")
        for (var i=0; i<config.boxes; i++) {
          var bx = $("<div class=\"rankbox\"></div>");
          rightCell.append(bx);
          if (rank != 0 && i < rank) {
            bx.css("background-color", config.colors[rank % config.colors.length]);
          }
        }
        rowHtml.append(leftCell);
        rowHtml.append(rightCell);
      });
      rows.push(rowHtml);
      listOrder = _.rest(listOrder, 3)
    }
    $(".app").append(rows);
  }

  render(config.state)
  $(".image-link").attr("href", "/"+config.state.generateHash()+".png")
  if (location.search.indexOf("png=1") != -1) {
    $(".novis").css("display", "none")
  }

  var setRank = function(box, rank, test) {
    var parent = $(box).parent()
    onz = typeof test !== "undefined" && test !== null && test ? function(){return rank} : (function(){$(parent).data("rank", rank); config.state.setRank($(parent).data("val"), rank); return rank})
    rank = typeof rank !== "undefined" && rank !== null ? onz() : $(parent).data("rank");

    var bg = config.colors[rank % config.colors.length]
    $(parent).children(".rankbox").each(function () {
      var idx = $(this).index()
      if (idx < rank) {
        $(this).css("background-color", bg)
      } else {
        $(this).css("background-color", config.colors[0])
      }
    });
  };

  $(".rankbox").hover(
    function () {
      var rank = $(this).index()+1;
      $(this).css("box-shadow", "0px 0px 20px "+config.colors[rank % config.colors.length])
      setRank($(this), rank, true)
    },
    function () {
      $(this).css("box-shadow", "none")
      setRank($(this))
    }
  );

  $(".rankbox").click(
    function () {
      var parent = $(this).parent();
      var rank = $(this).index()+1;
      if ($(parent).data("rank") == rank) {
        setRank($(this), 0)
      } else {
        setRank($(this), rank)
      }
    }
  );
})()