# Generated by Django 4.2.3 on 2023-09-01 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_userprofile_profile_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sessiondata',
            name='details',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]