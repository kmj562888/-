#!/usr/bin/env bash
# 다카마쓰 가이드를 GitHub Pages에 올리고 Pages를 켜는 스크립트.
# 전제: kmj562888/takamatsu-trip 저장소가 존재하고 Pickle GitHub 앱이 그 저장소에 접근 가능해야 함.
set -uo pipefail
REPO="kmj562888/takamatsu-trip"
BRANCH="main"
cd "$(dirname "$0")" || exit 1

echo "== 1) push =="
git push -u origin "$BRANCH" 2>&1

echo "== 2) Pages 켜기 (이미 켜져 있으면 409) =="
gh api -X POST "/repos/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/' 2>&1 | head -c 500
echo
# 위 호출이 실패하면 PUT으로 재시도
gh api -X PUT "/repos/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/' 2>&1 | head -c 500
echo

echo "== 3) 빌드 상태 =="
for i in $(seq 1 20); do
  st=$(gh api "/repos/$REPO/pages" --jq '.status' 2>/dev/null)
  url=$(gh api "/repos/$REPO/pages" --jq '.html_url' 2>/dev/null)
  echo "  [$i] status=$st url=$url"
  [ "$st" = "built" ] && break
  sleep 15
done

echo "== 4) 실제 응답 확인 =="
curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://kmj562888.github.io/takamatsu-trip/"
