# 📦 Next.js Bundle Analyzer

This GitHub Action is designed to evaluate the size of your Next.js code bundle
and assess changes in its size over time. It's particularly useful for
monitoring the impact of new code changes on the overall bundle size.

## Features

- **Bundle Size Analysis**: Generates a detailed report of the Next.js bundle
  size.
- **Comparison with Default Branch**: Compares the bundle size against the
  specified default branch.
- **Budget Check**: Allows setting a size budget for your bundle to ensure it
  doesn't exceed a certain limit.
- **Comment on PRs**: Automatically comments the generated report on the pull
  request for easy access and review.

## Inputs

- **workflow-id**: The ID of the workflow containing this step. `Required`.
- **github-token**: Token for GitHub operations (issues: write, pull-requests:
  write) or a repo scoped [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). `Required`.
- **default-branch**: The default branch of the repository
  (e.g., main or master). Default: `main`.
- **prefix**: The Next.js distribution directory. Default: `.next`.
- **budget**: The bundle size budget in kilobytes. Default: `200`.

## Usage

To use this action in your workflow, add the following step:

```yml
- name: Analyze bundle size
  uses: grokku/nextjs-bundle-analyzer@v1
  with:
    workflow-id: bundle_analysis.yml
    default-branch: main
    prefix: .next
    budget: 200
    github-token: ${{ secrets.CREATE_OR_UPDATE_COMMENT }}
```

Make sure to replace the **workflow-id**, **default-branch**, **prefix**,
**budget**, and **github-token** with your specific configurations.

## Example Report

The action generates a detailed report of the bundle size, including information
on new, changed, and deleted pages, as well as a comparison with the set
budget.

Here's an example of the report:

---

🏋️ Total bundle size increased `+26B (+0.03%)`\
📄 `1` new, `2` changed and `1` deleted pages

| Status | Route        | Size Change    | Total Size | % of Budget     |
| ------ | ------------ | -------------- | ---------- | --------------- |
| +      | /contacts    | +141B          | 83.36kB    | 41.75%          |
| ±      | /            | 141B (-6.86kB) | 83.36kB    | 41.75% (-3.43%) |
| ±      | /help        | 7kB (+6.86kB)  | 90.22kB    | 48.61% (+3.43%) |
|        | /\_not-found | 882B           | 84.08kB    | 42.47%          |
| −      | /about       | -141B          |            |                 |

<details>
<summary>
  JS shared by all pages <code>83.22kB</code>
</summary>
<br>

📦 `1` new, `0` changed and `1` deleted files
| Status | Chunk file name | Size |
| ------ | --------------- | ---- |
| + | static/chunks/webpack-87aca131f6318876.js | +1.65kB |
| | static/chunks/472-a7c17b00f8ce392b.js | 29.3kB |
| | static/chunks/fd9d1056-39de21f001c52188.js | 52.03kB |
| | static/chunks/main-app-5d94579e325bc22d.js | 232B |
| − | static/chunks/webpack-985ed4bb0324d1ca.js | -1.66kB |

</details>

<details>
<summary>
CSS shared by all pages <code>2.21kB</code>
</summary>
<br>

📦 `1` new, `0` changed and `1` deleted files
| Status | Chunk file name | Size |
| ------ | --------------- | ---- |
| + | static/css/e98333ef5fb896be.css | +2.21kB |
| − | static/css/280574e43cee558f.css | -2.18kB |

</details>

---

End of example.

## Contributing

Contributions to the "Next.js Bundle Analyzer" action are welcome. Please ensure
that your contributions adhere to the project's coding standards and include
appropriate tests.
