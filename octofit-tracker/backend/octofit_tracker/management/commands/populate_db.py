from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

# MODELS (simplificados para ejemplo, normalmente estarían en models.py)
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'

class Activity(models.Model):
    name = models.CharField(max_length=100)
    user = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(models.Model):
    user = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    score = models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    user = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        # Borrar datos existentes
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Equipos
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Usuarios
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', password='test', first_name='Tony', last_name='Stark'),
            User.objects.create_user(username='spiderman', email='spiderman@marvel.com', password='test', first_name='Peter', last_name='Parker'),
            User.objects.create_user(username='batman', email='batman@dc.com', password='test', first_name='Bruce', last_name='Wayne'),
            User.objects.create_user(username='wonderwoman', email='wonderwoman@dc.com', password='test', first_name='Diana', last_name='Prince'),
        ]

        # Actividades
        Activity.objects.create(name='Correr', user='ironman', team='Marvel')
        Activity.objects.create(name='Nadar', user='spiderman', team='Marvel')
        Activity.objects.create(name='Volar', user='batman', team='DC')
        Activity.objects.create(name='Luchar', user='wonderwoman', team='DC')

        # Leaderboard
        Leaderboard.objects.create(user='ironman', team='Marvel', score=100)
        Leaderboard.objects.create(user='spiderman', team='Marvel', score=80)
        Leaderboard.objects.create(user='batman', team='DC', score=90)
        Leaderboard.objects.create(user='wonderwoman', team='DC', score=95)

        # Workouts
        Workout.objects.create(name='Pushups', description='20 pushups', user='ironman')
        Workout.objects.create(name='Situps', description='30 situps', user='spiderman')
        Workout.objects.create(name='Squats', description='40 squats', user='batman')
        Workout.objects.create(name='Plank', description='60s plank', user='wonderwoman')

        self.stdout.write(self.style.SUCCESS('Test data loaded into octofit_db!'))
