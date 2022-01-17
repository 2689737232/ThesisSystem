from django.db import models

class User(models.Model):
   name = models.CharField(max_length=5, default="")
   age = models.IntegerField(default=0)



