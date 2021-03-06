// Generated by CoffeeScript 1.7.0
(function() {
  var BaseController, BaseModel, BaseView, CategoryController, CategoryListView, CategoryModel, DocumentController, DocumentEditorView, DocumentItemView, DocumentListView, DocumentModel, EventEmitter, Router, Storage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  this.Models = {};

  this.Controllers = {};

  this.Views = {};

  $(function() {
    Controllers.DocumentController.init();
    Controllers.CategoryController.init();
    return $("#sidebar a").on("click", function(event) {
      var route;
      event.preventDefault();
      route = $(event.currentTarget).attr("href");
      return Router.call(route);
    });
  });

  BaseController = (function() {
    function BaseController() {}

    BaseController.init = function(model, views) {
      this.model = model;
      return this.views = views;
    };

    BaseController.list = function() {
      var listView;
      listView = new this.views.list();
      return listView.render(this.model.all());
    };

    BaseController.show = function(id) {
      var itemView;
      itemView = new this.views.item();
      return itemView.render(this.model.read(id));
    };

    BaseController.edit = function(id) {
      var editorView;
      editorView = new this.views.editor();
      return editorView.render(this.model.read(id));
    };

    BaseController.create = function(id) {
      var editorView;
      editorView = new this.views.editor();
      return editorView.render(this.model.read());
    };

    BaseController.update = function(record) {
      this.model.update(record);
      return this.list();
    };

    BaseController.store = function(record) {
      record.id = new Date().getTime();
      this.model.create(record);
      return this.list();
    };

    BaseController["delete"] = function(id) {
      this.model["delete"](id);
      return this.list();
    };

    return BaseController;

  })();

  Controllers.BaseController = BaseController;

  CategoryController = (function(_super) {
    __extends(CategoryController, _super);

    function CategoryController() {
      return CategoryController.__super__.constructor.apply(this, arguments);
    }

    CategoryController.init = function() {
      CategoryController.__super__.constructor.init.call(this, new Models.CategoryModel(), {
        list: Views.CategoryListView
      });
      EventEmitter.on("category:update", function(record) {
        return CategoryController.update(record);
      });
      return EventEmitter.on("category:store", function(record) {
        return CategoryController.store(record);
      });
    };

    return CategoryController;

  })(Controllers.BaseController);

  Controllers.CategoryController = CategoryController;

  DocumentController = (function(_super) {
    __extends(DocumentController, _super);

    function DocumentController() {
      return DocumentController.__super__.constructor.apply(this, arguments);
    }

    DocumentController.init = function() {
      DocumentController.__super__.constructor.init.call(this, new Models.DocumentModel(), {
        list: Views.DocumentListView,
        item: Views.DocumentItemView,
        editor: Views.DocumentEditorView
      });
      EventEmitter.on("document:update", function(record) {
        return DocumentController.update(record);
      });
      EventEmitter.on("document:store", function(record) {
        return DocumentController.store(record);
      });
      EventEmitter.on("document:show", function(id) {
        return DocumentController.show(id);
      });
      EventEmitter.on("document:filter", function(category) {
        return DocumentController.list(category);
      });
      return DocumentController.list();
    };

    DocumentController.list = function(category) {
      var listView;
      if (category) {
        listView = new this.views.list();
        return listView.render(this.model.getByCategory(category), category);
      } else {
        return DocumentController.__super__.constructor.list.call(this);
      }
    };

    return DocumentController;

  })(Controllers.BaseController);

  Controllers.DocumentController = DocumentController;

  BaseModel = (function() {
    function BaseModel(key) {
      this.key = key;
      this.data = Storage.get(this.key) || {};
    }

    BaseModel.prototype.all = function() {
      return this.data;
    };

    BaseModel.prototype.create = function(record) {
      if (!this.data[record.id]) {
        this.data[record.id] = record;
        this.persist();
        return true;
      }
      return false;
    };

    BaseModel.prototype.read = function(id) {
      if (this.data[id]) {
        return this.data[id];
      }
      return false;
    };

    BaseModel.prototype.update = function(record) {
      if (this.data[record.id]) {
        this.data[record.id] = record;
        this.persist();
        return true;
      }
      return false;
    };

    BaseModel.prototype["delete"] = function(id) {
      if (this.data[id]) {
        this.data[id] = null;
        delete this.data[id];
        this.persist();
        return true;
      }
      return false;
    };

    BaseModel.prototype.persist = function() {
      return Storage.set(this.key, this.data);
    };

    return BaseModel;

  })();

  Models.BaseModel = BaseModel;

  CategoryModel = (function(_super) {
    __extends(CategoryModel, _super);

    function CategoryModel() {
      CategoryModel.__super__.constructor.call(this, "category");
    }

    return CategoryModel;

  })(Models.BaseModel);

  Models.CategoryModel = CategoryModel;

  DocumentModel = (function(_super) {
    __extends(DocumentModel, _super);

    function DocumentModel() {
      DocumentModel.__super__.constructor.call(this, "document");
    }

    DocumentModel.prototype.getByCategory = function(category) {
      var filtered, id;
      filtered = {};
      for (id in this.data) {
        if (this.data[id].category === category) {
          filtered[id] = this.data[id];
        }
      }
      return filtered;
    };

    return DocumentModel;

  })(Models.BaseModel);

  Models.DocumentModel = DocumentModel;

  Router = (function() {
    function Router() {}

    Router.routes = {
      'documents': Controllers.DocumentController.list,
      'document/show': Controllers.DocumentController.show,
      'document/edit': Controllers.DocumentController.edit,
      'document/new': Controllers.DocumentController.create,
      'categories': Controllers.CategoryController.list
    };

    Router.call = function() {
      var parameters, route;
      route = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.routes[route].call(this.context(route), parameters > 0 ? parameters : false);
    };

    Router.context = function(route) {
      var contexts;
      contexts = {
        "document": Controllers.DocumentController,
        "documents": Controllers.DocumentController,
        "category": Controllers.CategoryController,
        "categories": Controllers.CategoryController
      };
      return contexts[route.split("/")[0]];
    };

    return Router;

  })();

  this.Router = Router;

  EventEmitter = (function(_super) {
    __extends(EventEmitter, _super);

    function EventEmitter() {
      return EventEmitter.__super__.constructor.apply(this, arguments);
    }

    return EventEmitter;

  })(Backbone.Events);

  this.EventEmitter = EventEmitter;

  Storage = (function() {
    function Storage() {}

    Storage.get = function(key) {
      return JSON.parse(localStorage.getItem(key));
    };

    Storage.set = function(key, value) {
      return localStorage.setItem(key, JSON.stringify(value));
    };

    return Storage;

  })();

  this.Storage = Storage;

  BaseView = (function() {
    function BaseView(element, template) {
      this.element = element;
      this.template = template;
    }

    BaseView.prototype.render = function(data) {
      return this.element.html(this.template(data));
    };

    return BaseView;

  })();

  Views.BaseView = BaseView;

  CategoryListView = (function(_super) {
    __extends(CategoryListView, _super);

    function CategoryListView() {
      CategoryListView.__super__.constructor.call(this, $("#canvas"), function(data) {
        var id, item, output;
        output = "<ul class='categories'>";
        for (id in data) {
          item = data[id];
          output += "<li data-id='" + item.id + "'> <div class='title'>" + item.title + "</div> </li>";
        }
        output += "</ul>";
        return output;
      });
    }

    CategoryListView.prototype.render = function(data) {
      CategoryListView.__super__.render.call(this, data);
      return this.bind();
    };

    CategoryListView.prototype.bind = function() {
      return this.element.find('li').on('click', function(event) {
        var name;
        name = $(event.currentTarget).text();
        return EventEmitter.trigger('document:filter', name.trim());
      });
    };

    return CategoryListView;

  })(Views.BaseView);

  Views.CategoryListView = CategoryListView;

  DocumentEditorView = (function(_super) {
    __extends(DocumentEditorView, _super);

    function DocumentEditorView() {
      DocumentEditorView.__super__.constructor.call(this, $("#canvas"), (function(_this) {
        return function(doc) {
          var $output, output;
          if (doc == null) {
            doc = false;
          }
          output = "<label class='formitem'>title</label> <input class='formitem' type='text' name='title' /> <label class='formitem'>content</label> <div name='content'></div> <label class='formitem'>category</label> <select class='formitem' name='category'></select><button data-action='add-category'>+</button> <div class='actions'> <button class='formitem' data-action='save'>save</button> <button class='formitem' data-action='close'>cancel</button> </div>";
          $output = $("<div>");
          $output.html(output);
          $output.find("[name='content']").summernote({
            height: 400
          });
          if (doc) {
            $output.find("input[name='title']").val(doc.title);
            $output.find("[name='content']").code(doc.content);
            $output.find("[name='category']").val(doc.category);
            _this.id = doc.id;
            _this.mode = 'update';
            output = $output;
          } else {
            _this.mode = 'create';
          }
          return $output;
        };
      })(this));
    }

    DocumentEditorView.prototype.render = function(doc) {
      var categories, id;
      DocumentEditorView.__super__.render.call(this, doc);
      categories = new Models.CategoryModel().all();
      console.log(categories);
      for (id in categories) {
        console.log(categories[id].title);
        $("select[name='category']").append("<option>" + categories[id].title + "</option");
      }
      return this.bind();
    };

    DocumentEditorView.prototype.close = function() {
      this.element.find('button').off('click');
      return Router.call("documents");
    };

    DocumentEditorView.prototype.bind = function() {
      return this.element.find('button').on('click', (function(_this) {
        return function(event) {
          var action, record, select, target, textbox;
          target = $(event.currentTarget);
          action = target.attr('data-action');
          switch (action) {
            case "save":
              record = {
                title: _this.element.find("input[name='title']").val(),
                content: _this.element.find("[name='content']").code(),
                category: _this.element.find("[name='category']").val()
              };
              if (_this.mode === 'update') {
                record.id = _this.id;
                EventEmitter.trigger('document:update', record);
              } else {
                EventEmitter.trigger('document:store', record);
              }
              if (_this.categoryMode === 'add') {
                EventEmitter.trigger('category:store', {
                  title: record.category
                });
              }
              _this.close();
              return alert("Document saved");
            case "add-category":
              select = $("select[name='category']");
              textbox = $("<input name='category' />");
              select.replaceWith(textbox);
              $("button[data-action='add-category']").remove();
              return _this.categoryMode = 'add';
            case "close":
              return _this.close();
          }
        };
      })(this));
    };

    return DocumentEditorView;

  })(Views.BaseView);

  Views.DocumentEditorView = DocumentEditorView;

  DocumentItemView = (function(_super) {
    __extends(DocumentItemView, _super);

    function DocumentItemView() {
      DocumentItemView.__super__.constructor.call(this, $("#canvas"), function(doc) {
        return "<article> <h1>" + doc.title + "</h1> " + doc.content + " </article> <div class='category'>" + doc.category + "</div> <div class='actions'> <button class='formitem' data-action='edit' data-id='" + doc.id + "'>Edit</button> <button class='formitem' data-action='export' data-id='" + doc.id + "'>Export</button> <button class='formitem' data-action='delete' data-id='" + doc.id + "'>Delete</button> <button class='formitem' data-action='close'>Close</button> </div>";
      });
    }

    DocumentItemView.prototype.render = function(data) {
      DocumentItemView.__super__.render.call(this, data);
      return this.bind();
    };

    DocumentItemView.prototype.close = function() {
      this.element.find('button').off('click');
      return Router.call("documents");
    };

    DocumentItemView.prototype.bind = function() {
      return this.element.find('button').on('click', (function(_this) {
        return function(event) {
          var action, doc, link, target;
          target = $(event.currentTarget);
          action = target.attr('data-action');
          switch (action) {
            case 'edit':
              return Controllers.DocumentController.edit(target.attr('data-id'));
            case 'export':
              doc = new jsPDF;
              doc.fromHTML(_this.element.find('article').html(), 20, 20, {
                width: 210,
                height: 297,
                elementHandlers: {}
              });
              link = document.createElement("a");
              link.download = "" + (_this.element.find('h1').text()) + ".pdf";
              link.href = doc.output('datauristring');
              return link.click();
            case 'delete':
              if (confirm("Are you sure?")) {
                return Controllers.DocumentController["delete"](target.attr('data-id'));
              }
              break;
            case 'close':
              return _this.close();
          }
        };
      })(this));
    };

    return DocumentItemView;

  })(Views.BaseView);

  Views.DocumentItemView = DocumentItemView;

  DocumentListView = (function(_super) {
    __extends(DocumentListView, _super);

    function DocumentListView() {
      DocumentListView.__super__.constructor.call(this, $("#canvas"), function(data) {
        var id, item, output;
        output = "<h1 class='category-title'></h1>";
        output += "<ul class='documents'>";
        for (id in data) {
          item = data[id];
          output += "<li data-id='" + item.id + "'> <img src='assets/document.png' /> <div class='title'>" + item.title + "</div> </li>";
        }
        output += "</ul><div class='clear'></div>";
        return output;
      });
    }

    DocumentListView.prototype.render = function(data, category) {
      if (category == null) {
        category = false;
      }
      DocumentListView.__super__.render.call(this, data);
      if (category) {
        $('.category-title').text(category);
      }
      return this.bind();
    };

    DocumentListView.prototype.bind = function() {
      return this.element.find('li').on('click', function(event) {
        var id;
        id = $(event.currentTarget).attr("data-id");
        return EventEmitter.trigger("document:show", id);
      });
    };

    return DocumentListView;

  })(Views.BaseView);

  Views.DocumentListView = DocumentListView;

}).call(this);
