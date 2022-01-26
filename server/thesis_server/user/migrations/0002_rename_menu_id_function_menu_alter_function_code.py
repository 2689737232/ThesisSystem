# Generated by Django 4.0.1 on 2022-01-26 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='function',
            old_name='menu_id',
            new_name='menu',
        ),
        migrations.AlterField(
            model_name='function',
            name='code',
            field=models.CharField(choices=[('2000001', '浏览我的文档'), ('2000002', '删除我的文档'), ('2000003', '修改自己文档'), ('2000004', '添加学生'), ('2000005', '添加教师'), ('2000006', '导入文档'), ('2000007', '权限修改'), ('2000008', '恢复文档'), ('2000009', '浏览其他文献')], max_length=7, unique=True),
        ),
    ]
