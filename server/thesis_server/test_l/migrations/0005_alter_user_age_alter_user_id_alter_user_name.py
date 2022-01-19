# Generated by Django 4.0.1 on 2022-01-19 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_l', '0004_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='age',
            field=models.IntegerField(default=0, verbose_name='用户年龄'),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(default='', max_length=5, verbose_name='用户名'),
        ),
    ]
