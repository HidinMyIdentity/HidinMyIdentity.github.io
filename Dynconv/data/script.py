# Robert Roberts
from bs4 import BeautifulSoup
import requests
import json

base = requests.get("https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8").content

ret = []

parsed = BeautifulSoup(base)
for x in parsed.find_all("tr"):
    if not x.find("th"):
        children = list(x.findChildren(recursive=False))

        if len(children) != 4:
            print children
        else:
            fro = children[0].text
            to = children[1].text
            conv = float(children[2].text.encode('ascii', 'ignore').replace(" ", "") + children[3].text.lower())
            ret.append((fro, to, conv))
        pass

print json.dumps(list(reversed(ret)))