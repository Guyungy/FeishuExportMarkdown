import os
import requests
import pypandoc

def download_image(url):
    response = requests.get(url)
    return response.content

def convert_doc_to_md(doc_url, access_token):
    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get(doc_url, headers=headers)
    response.raise_for_status()
    doc_json = response.json()
    title = doc_json["title"]
    content_blocks = doc_json["content"]
    md_text = f"# {title}\n\n"
    for block in content_blocks:
        block_type = block["type"]
        if block_type == "text":
            md_text += block["content"] + "\n\n"
        elif block_type == "image":
            image_url = block["url"]
            image_name = os.path.basename(image_url)
            image_content = download_image(image_url)
            with open(image_name, "wb") as f:
                f.write(image_content)
            md_text += f"![{image_name}]({image_name})\n\n"
    md_text = pypandoc.convert_text(md_text, "md", format="html")
    return md_text

if __name__ == "__main__":
    doc_url = "https://test.feishu.cn/docx/test"
    access_token = "xxxxxxxxxxxxxxxxxx"
    md_text = convert_doc_to_md(doc_url, access_token)
    with open("output.md", "w", encoding="utf-8") as f:
        f.write(md_text)
