# Generated by Django 4.2.3 on 2023-09-08 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_assignmentsubmissiondb_submitted_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignmentpostdb',
            name='submitted',
        ),
        migrations.AddField(
            model_name='assignmentsubmissiondb',
            name='submitted',
            field=models.BooleanField(default=False),
        ),
    ]