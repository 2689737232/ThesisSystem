# Generated by Django 4.0.1 on 2022-01-21 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_l', '0011_alter_user_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='password',
        ),
        migrations.AddField(
            model_name='user',
            name='password_bcrypt',
            field=models.CharField(default='123456', max_length=150),
        ),
    ]