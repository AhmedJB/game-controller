# Generated by Django 4.2.8 on 2023-12-31 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('handler', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='settings',
            name='export_folder',
            field=models.CharField(default='', max_length=500),
        ),
    ]
