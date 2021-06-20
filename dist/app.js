// Generated by CoffeeScript 2.5.1
(function() {
  var BaseController, BaseModel, BaseView, CategoryController, CategoryEditorView, CategoryItemView, CategoryListView, CategoryModel, DocumentController, DocumentModel, Router, Storage;

  this.Models = {};

  this.Controllers = {};

  this.Views = {};

  $(function() {
    Controllers.DocumentController.init();
    return $("#sidebar a").on("click", function(event) {
      var route;
      event.preventDefault();
      route = $(event.currentTarget).attr("href");
      return Router.call(route);
    });
  });

  BaseController = class BaseController {};

  Controllers.BaseController = BaseController;

  CategoryController = class CategoryController extends Controllers.BaseController {};

  Controllers.CategoryController = CategoryController;

  DocumentController = class DocumentController extends Controllers.BaseController {};

  Controllers.DocumentController = DocumentController;

  BaseModel = class BaseModel {};

  Models.BaseModel = BaseModel;

  CategoryModel = class CategoryModel extends Models.BaseModel {};

  Models.CategoryModel = CategoryModel;

  DocumentModel = class DocumentModel extends Models.BaseModel {};

  Models.DocumentModel = DocumentModel;

  Router = class Router {};

  this.Router = Router;

  Storage = class Storage {};

  this.Storage = Storage;

  BaseView = class BaseView {
    constructor(element, template) {
      this.element = element;
      this.template = template;
    }

    render(data) {
      return this.element.html(this.template(data));
    }

  };

  Views.BaseView = BaseView;

  CategoryEditorView = class CategoryEditorView extends Views.BaseView {};

  Views.CategoryEditorView = CategoryEditorView;

  CategoryItemView = class CategoryItemView extends Views.BaseView {};

  Views.CategoryItemView = CategoryItemView;

  CategoryListView = class CategoryListView extends Views.BaseView {};

  Views.CategoryListView = CategoryListView;

}).call(this);
