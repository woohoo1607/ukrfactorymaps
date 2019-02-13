var app = {
    map: null,
    markers: null,
    $panel: null,
    init: function () {
        this.$panel = jQuery('#panel');
        //this.ajaxSend("5");
        //this.ajaxSend("4");
        this.map = L.map('mapid').setView([48.70, 31.30], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.markers = L.markerClusterGroup({
            maxClusterRadius: 50,
            disableClusteringAtZoom: 17,
            spiderfyOnMaxZoom: false
        });

        this.ajax();
        this.addEventListeners();
        
    },
    addEventListeners: function () {
        
    },

    addfactory: function (arr) {
        var _this = this;
        for (var i = 0; i < arr.length; i++) {
            var coordinats = [arr[i].longitude, arr[i].latitude];
            var myMarker = new L.marker(coordinats, {title: arr[i].name, id: arr[i].id}).on('click', function (e) {
                _this.ajaxSend(this.options.id);
            });

            this.markers.addLayer(myMarker);
            this.markers.on('click', function (e) {
            });
            this.map.addLayer(this.markers);
        }
    },

    fillPanel: {
        $panelBody: null,
        sortNameFactory: null,
        uniqCategory: null,
        init: function (arr) {
            this.$panelBody = jQuery('#panel .panelBody');
            var $heightHeader = jQuery('#panel .panelHeader').outerHeight(true);
            var $heightFooter = jQuery('#panel .panelFooter').outerHeight(true);
            var $heightWindow = jQuery(window).height();
            var heightBody = $heightWindow-$heightHeader-$heightFooter;
            jQuery('#panel .panelBody').css('height', heightBody); //задаем высоту body
            this.createList(arr);
            this.addList();
            
        },
        createList: function (arr) {
            var categorys = {};
            for (var i = 0; i < arr.length; i++) {
                var category = arr[i].category;
                categorys[category] = true;
            }
            var uniqCategory = Object.keys(categorys); //получили массив уникальных категорий

            var sortNameFactory = []; //создаем массив в котором будут масивы с названиями заводов по категориям
            //i-й массив будет соответствовать і-й категории массива uniqCategory
            for (var i = 0; i < uniqCategory.length; i++) {
                sortNameFactory[i] = [];
            }
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < uniqCategory.length; j++) {
                    if (arr[i].category === uniqCategory[j]) {
                        sortNameFactory[j].push(arr[i].name);
                    }
                }
            }
            this.sortNameFactory = sortNameFactory;
            this.uniqCategory = uniqCategory;
        },
        addList: function () {
            for (var i = 0; i < this.uniqCategory.length; i++) {
                var $divCategory = jQuery('<div></div>').appendTo(this.$panelBody);
                $divCategory.addClass('category');
                if (!this.uniqCategory[i]) {
                    title = "<h3>Інші</h3>";
                } else {
                var title = "<h3>"+this.uniqCategory[i]+"</h3>";
                }
                $divCategory.append(title);
                var $myUl = jQuery('<ul></ul>').appendTo($divCategory);
                var list = '';
                for (var j = 0; j < this.sortNameFactory[i].length; j++) {
                    list = list+'<li>'+this.sortNameFactory[i][j]+'</li>';
                }
                $myUl.append(list);
            }
           
        }
    },
            

    ajax: function () {
        var xmlhttp = new XMLHttpRequest();
        var url = "get.php";

            function reqListener () {

                var myArr = JSON.parse(this.responseText);
                    app.fillPanel.init(myArr);
                    app.addfactory(myArr);
            }

        xmlhttp.addEventListener("load", reqListener);
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    ajaxSend: function (id) {
        var _this = this;
        var url = "getObject.php";
        data = {object: id};
        jQuery.get(url, data, function (data){
            var myArr = JSON.parse(data);
            _this.aboutFactory.create(myArr);
        });
    },
    aboutFactory: {
        container: null,
        name: null,
        owner: null,
        ownerSum: null,
        power: null,
        workerCount: null,
        dateBuilding: null,
        dateEnd: null,
        create: function(data) {
            var _this = this;
            if (this.container) {
                this.removeContainer();
            }
            this.name = data.factory.name;
            this.owner = data.factory.owner;
            this.ownerSum = data.factory.owner_sum;
            this.power = data.factory.power;
            this.workerCount = data.factory.worker_count;
            this.dateBuilding = data.factory.dateBg;
            this.dateEnd = data.factory.dateEnd;
            
            this.container = document.createElement('div');
            jQuery(this.container).attr('id', 'aboutObject');

            var aboutHeader = this.createHeader(this.name);
            
            var aboutBody = this.createBody();
            
            var aboutFooter = this.createFooter();
            
            this.container.appendChild(aboutHeader);
            this.container.appendChild(aboutBody);
            this.container.appendChild(aboutFooter);
            app.$panel.removeClass('show');
            jQuery('#myFlex').append(this.container);
            
            var $ul = jQuery('#aboutObject .objBody ul');
            
            if (this.name) {
                $ul.append('<li><span>Назва:</span> '+this.name+'</li>');
            }
            if (this.owner) {
                $ul.append('<li><span>Власник:</span> '+this.owner+'</li>');
            }
            if (this.ownerSum) {
                $ul.append('<li><span>Об\'єм інвестицій:</span> '+this.ownerSum+'</li>');
            }
            if (this.power) {
                $ul.append('<li><span>Потужність:</span> '+this.power+'</li>');
            }
            if (this.workerCount) {
                $ul.append('<li><span>Кількість робітників:</span> '+this.workerCount+'</li>');
            }
            if (this.dateBuilding) {
                $ul.append('<li><span>Дата будівництва:</span> '+this.dateBuilding+'</li>');
            }
            if (this.dateEnd) {
                $ul.append('<li><span>Дата відкриття:</span> '+this.dateEnd+'</li>');
            }
            
            this.addEventListeners();
        },
        createHeader: function (text) {
            var header = document.createElement('div');
            var title = document.createElement('h2');
            var button = document.createElement('button');
            
            header.classList.add('objHeader');
            button.setAttribute('type', 'button');
            
            button.appendChild(document.createTextNode('X'));
            
            text = text || 'Детальніше про об\'єкт';
            title.appendChild(document.createTextNode(text));
            
            header.appendChild(title);
            header.appendChild(button);

            return header;
        },
        createBody: function () {
            var body = document.createElement('div');
            var myUl = document.createElement('ul');
            
            body.classList.add('objBody');
            
            body.appendChild(myUl);

            return body;
        },
        createFooter: function () {
            var footer = document.createElement('div');

            footer.classList.add('objFooter');

            return footer;
        },

        addEventListeners: function () {
            var _this = this;
            var $buttonClose = jQuery('#aboutObject .objHeader button');
            $buttonClose.on('click', function () {
                _this.removeContainer();
            });
        },

        removeContainer: function () {
            if (!this.container) {
                return;
            }
            jQuery('#aboutObject').remove();
            app.$panel.addClass('show');
            this.container = null;
        }
    }
};

jQuery(document).ready(function () {
    app.init();
});