#!/usr/bin/env python3
"""
Refactor MUI imports to custom UI components
"""
import re
import sys

def refactor_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace imports
    content = re.sub(
        r'from \'@mui/material\';',
        r"from '../ui/card';\nimport { Button } from '../ui/button';\nimport { Badge } from '../ui/badge';\nimport { Alert } from '../ui/alert';\nimport { Select, FormControl, InputLabel, MenuItem } from '../ui/select';\nimport { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '../ui/table';\nimport { Accordion, AccordionSummary, AccordionDetails } from '../ui/accordion';\nimport { Divider } from '../ui/divider';",
        content,
        flags=re.MULTILINE
    )

    content = re.sub(
        r'from \'@mui/icons-material\';',
        r"from '../ui/icons';",
        content
    )

    # Replace sx props with className
    replacements = [
        (r'sx=\{\{ p: 3 \}\}', 'className="p-6"'),
        (r'sx=\{\{ mb: 3 \}\}', 'className="mb-6"'),
        (r'sx=\{\{ mb: 2 \}\}', 'className="mb-4"'),
        (r'sx=\{\{ mt: 2 \}\}', 'className="mt-4"'),
        (r'sx=\{\{ mt: 3 \}\}', 'className="mt-6"'),
        (r'sx=\{\{ mt: 1 \}\}', 'className="mt-2"'),
        (r'sx=\{\{ my: 2 \}\}', 'className="my-4"'),
        (r'sx=\{\{ p: 2, textAlign: \'center\' \}\}', 'className="p-4 text-center"'),
        (r'<Box ', '<div '),
        (r'</Box>', '</div>'),
        (r'<Grid ', '<div '),
        (r'</Grid>', '</div>'),
        (r'gutterBottom', 'className="mb-2"'),
        (r'paragraph', ''),
        (r'variant="outlined"', ''),
        (r'component=\{Paper\}', ''),
        (r'fontSize="small"', 'className="w-4 h-4"'),
        (r'size="small"', 'className="text-sm"'),
        (r'color="text.secondary"', 'className="text-gray-600"'),
        (r'align="right"', 'className="text-right"'),
        (r'align="center"', 'className="text-center"'),
        (r'severity="info"', 'variant="default"'),
        (r'severity="error"', 'variant="error"'),
        (r'severity="warning"', 'variant="warning"'),
        (r'severity="success"', 'variant="success"'),
        (r'color="primary"', 'className="text-blue-600"'),
        (r'color="warning.main"', 'className="text-yellow-600"'),
        (r'color="success.main"', 'className="text-green-600"'),
        (r'color="error"', 'className="text-red-600"'),
        (r'color="success"', 'className="text-green-600"'),
        (r'color="warning"', 'className="text-yellow-600"'),
        (r'sx=\{\{ mb: 3, display: \'flex\', gap: 2, flexWrap: \'wrap\' \}\}', 'className="mb-6 flex gap-4 flex-wrap"'),
        (r'variant="contained"', ''),
        (r'variant="outlined"', 'variant="outline"'),
        (r'startIcon=\{<Calculate />\}', ''),
        (r'startIcon=\{<Refresh />\}', ''),
        (r'label=\{', 'children={'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    # Fix Typography to plain elements
    content = re.sub(r'<Typography variant="h4"([^>]*)>', r'<h1 \1>', content)
    content = re.sub(r'<Typography variant="h6"([^>]*)>', r'<h2 \1>', content)
    content = re.sub(r'<Typography variant="subtitle2"([^>]*)>', r'<h3 \1>', content)
    content = re.sub(r'<Typography variant="body1"([^>]*)>', r'<p \1>', content)
    content = re.sub(r'<Typography variant="body2"([^>]*)>', r'<p \1>', content)
    content = re.sub(r'<Typography variant="caption"([^>]*)>', r'<span \1>', content)
    content = re.sub(r'</Typography>', lambda m: '</h1>' if '<h1' in content[:content.index(m.group())] else '</p>', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Refactored {file_path}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python refactor-mui.py <file>")
        sys.exit(1)

    refactor_file(sys.argv[1])
