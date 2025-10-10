# Generated migration for adding progress field to Goal model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_motivationalquote'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='progress',
            field=models.IntegerField(default=0),
        ),
    ]
