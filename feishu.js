// ==UserScript==
// @name         Feishu Doc to Markdown Exporter
// @version      1.0
// @description  Export Feishu Docs to Markdown format
// @author       Your Name
// @match        https://www.feishu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 获取文档内容的函数
    function getDocContent() {
        let content = '';
        // 获取标题
        const title = document.querySelector('.doc-title').textContent.trim();
        content += `# ${title}\n\n`;

        // 获取正文
        const docBody = document.querySelector('.doc-body');
        const sections = docBody.querySelectorAll('.section');
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                content += `## ${sectionTitle.textContent.trim()}\n\n`;
            }
            const paragraphs = section.querySelectorAll('.paragraph');
            for (let j = 0; j < paragraphs.length; j++) {
                const paragraph = paragraphs[j];
                const text = paragraph.textContent.trim();
                if (text) {
                    content += `${text}\n\n`;
                }
            }
        }
        return content;
    }

    // 创建导出按钮
    function createExportButton() {
        const docHeader = document.querySelector('.doc-header');
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Markdown';
        exportButton.className = 'export-button';
        exportButton.addEventListener('click', () => {
            const content = getDocContent();
            const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.md';
            a.click();
        });
        docHeader.appendChild(exportButton);
    }

    // 等待页面加载完成后创建导出按钮
    window.addEventListener('load', () => {
        createExportButton();
    });
})();
