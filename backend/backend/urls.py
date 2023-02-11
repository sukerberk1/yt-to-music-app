"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import AudioViewSet, UsersViewSet, user_audio_lib, get_user_from_token, add_new_audio
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

router = DefaultRouter()
router.register(r'audios', AudioViewSet, 'AudioViewSet')
router.register(r'users', UsersViewSet, 'UsersViewSet')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token-obtain/', TokenObtainPairView.as_view() , name='api_token_auth'),
    path('api/token-refresh/', TokenRefreshView.as_view() , name='api_token_clear'),
    path('api/token-verify/', TokenVerifyView.as_view() , name='api_token_verify'),

    path('api/', include(router.urls), name='api'),

    path('api/userlib/', user_audio_lib, name='user_lib_view '),
    path('api/getuser/', get_user_from_token, name='get_user_from_authtoken'),
    path('api/addaudio/', add_new_audio, name='add_audio_to_lib'),
]
