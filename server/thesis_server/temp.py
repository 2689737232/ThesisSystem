# menu_code_dict = {
#     "我的文献": "1000001",
#     "浏览": "1000002",
#     "回收站": "1000003",
#     "添加用户": "1000004",
#     "导入": "1000005",
#     "权限修改": "1000006"
# }
# function_code_dict = {
#     "浏览我的文档": "2000001",
#     "删除我的文档": "2000002",
#     "修改自己文档": "2000003",
#     "添加学生": "2000004",
#     "添加教师": "2000005",
#     "导入文档": "2000006",
#     "权限修改": "2000007",
#     "恢复文档": "2000008",
#     "浏览其他文献": "2000009"
# }
# menu_function_dict = {
#     "我的文献": ["浏览我的文档", "删除我的文档", "修改自己文档"],
#     "浏览": ["浏览其他文献"],
#     "回收站": ["恢复文档"],
#     "添加用户": ["添加学生", "添加教师"],
#     "导入": ["导入文档"],
#     "权限修改": ["权限修改"]
# }

# menu_code_dict.keys()

# stu_menu = [
#     "我的文献",
#     "浏览"
# ]

# print(stu_menu.index("我的文献"))

from datetime import date

from django.db import models

class Blog(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.TextField()

class Author(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()

class Entry(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)  # 
    headline = models.CharField(max_length=255)
    body_text = models.TextField()
    pub_date = models.DateField()
    mod_date = models.DateField(default=date.today)
    authors = models.ManyToManyField(Author) #
    number_of_comments = models.IntegerField(default=0)
    number_of_pingbacks = models.IntegerField(default=0)
    rating = models.IntegerField(default=5)