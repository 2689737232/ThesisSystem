from django.urls import path, re_path
from . import views
from .view.Menu import Menu
from .view.Function import Function
from .view.Token import Token
from .view.PdfView import Pdf, PdfPages, PdfCollections, Search,  PdfHistory
urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("auth", views.AuthView.as_view(), name="auth"),
    path("menu", Menu.as_view(), name="menu"),
    path("function", Function.as_view(), name="function"),
    path("pdf", Pdf.as_view(), name="pdf"),
    path("pdfpages", PdfPages.as_view(), name="pdfpage"),
    path("pdfcollections", PdfCollections.as_view(), name="pdfcollections"),
    path("history", PdfHistory.as_view(), name="pdf_history"),
    path("token", Token.as_view(), name="token"),
    path("search", Search.as_view(), name="search_pdf")
]
