# Generated by Django 4.2.3 on 2023-07-26 15:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_userprofile_is_verfied_delete_verifieduser'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='is_verfied',
            new_name='is_verified',
        ),
    ]
