# Generated by Django 4.0.1 on 2022-04-04 07:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_userviewhistory_rename_userpdfs_usercollectpdfs_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userviewhistory',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_history', related_query_name='user_history', to='user.user'),
        ),
    ]
