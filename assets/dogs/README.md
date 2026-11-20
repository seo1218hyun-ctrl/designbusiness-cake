# Dog topper assets

사용자가 제공한 15종 캐릭터 시트를 참조한 배경 정리 버전입니다. Built-in image_gen으로 투명 시트를 만들었으므로 원본과 픽셀 단위로 동일하지 않으며 일부 윤곽이 달라질 수 있습니다.

- sheet.png: 투명 배경 정리 시트
- 견종별 PNG 15개: 정규화된 256×256 얼굴 이미지
- prepare-dogs.cjs: 투명 시트에서 견종별 이미지 분리 및 외부 잡티 정리
- dogs.js: 브라우저 Canvas에서 중성 털색 영역을 선택 색상으로 변경. PNG 자체는 변경하지 않습니다.
- 흰 무늬·분홍 귀·검은 눈코는 유지하고 털 영역을 휴리스틱으로 구분합니다. 두 가지 색은 외곽 귀와 어두운 털 영역에 보조색을 적용하며, 자유 배색 마스크 편집은 아닙니다.
- 믹스견·목록에 없는 견종은 전용 얼굴이 없어 토퍼를 숨깁니다.

## Background cleanup prompt (built-in image_gen)

Edit the user's attached 15 dog face sheet. Preserve all 15 faces, exact ordering, individual breed designs, outlines and neutral gray/white fur and pink inner ears. Remove the cyan background and cell backgrounds entirely, producing true transparent background. Arrange the same faces in an exact 5 columns x 3 rows uniform grid, each face centered in its equal cell, head and ears fully contained with 10% margins. Crop unnecessary outer blank margins; output landscape 5:3 canvas. Head only, trim neck extensions at chin. Do not add text or objects. This is production sprite sheet preparation; preserve original artwork as closely as possible.
