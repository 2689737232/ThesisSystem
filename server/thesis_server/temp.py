code_dict = {
    "我的文献": "1000001",
    "浏览": "1000002",
    "回收站": "1000003",
    "添加用户": "1000004",
    "导入": "1000005",
    "权限修改": "1000006"
}

l = []
for (key,val) in code_dict.items():
    l.append((val, key))
print(tuple(l))

# print(list(code_dict.keys()))
# print(list(code_dict.values()))