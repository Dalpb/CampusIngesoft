# Generated by Django 5.1.1 on 2024-12-14 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cursos', '0003_horario_numinscritos'),
    ]

    operations = [
        migrations.AddField(
            model_name='horario',
            name='numRetirados',
            field=models.IntegerField(default=0),
        ),
    ]
