// PCA 데이터를 시각화하는 함수
function createPCA(data) {
    // SVG 캔버스 설정
    const svg = d3.select('svg'); // SVG 요소 선택
    const margin = { top: 20, right: 30, bottom: 40, left: 50 }; // 마진 설정
    const width = 800 - margin.left - margin.right; // 그래프 너비
    const height = 600 - margin.top - margin.bottom; // 그래프 높이

    // 그래프 그룹 생성 및 마진 적용
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // 그래프의 스케일 설정
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.x) - 1, d3.max(data, d => d.x) + 1])  // 여유 공간 추가
        .range([0, width]); // x축 범위 설정

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.y) - 1, d3.max(data, d => d.y) + 1]) // y축 범위 설정
        .range([height, 0]); // y축은 위쪽에서 아래로 내려오기 때문에 역순

    // 클래스(레이블)에 대한 색상 스케일 정의
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 산점도 생성
    g.selectAll('circle')
        .data(data) // 데이터 바인딩
        .enter().append('circle') // 데이터가 추가될 때마다 원 추가
        .attr('cx', d => xScale(d.x)) // x 좌표
        .attr('cy', d => yScale(d.y)) // y 좌표
        .attr('r', 5) // 원의 반지름
        .attr('fill', d => color(d.label)) // 색상 설정
        .attr('stroke', 'black') // 테두리 색상
        .attr('stroke-width', 1); // 테두리 두께

    // X축 추가
    g.append('g')
        .attr('transform', `translate(0,${height})`) // y=height 위치로 이동
        .call(d3.axisBottom(xScale)); // x축 생성

    // Y축 추가
    g.append('g')
        .call(d3.axisLeft(yScale)); // y축 생성

    // X축 레이블 추가
    g.append('text')
        .attr('x', width / 2) // 중앙 위치
        .attr('y', height + margin.bottom - 5) // 위치 조정
        .style('text-anchor', 'middle') // 텍스트 중앙 정렬
        .text('PCA Component 1'); // 텍스트 내용

    // Y축 레이블 추가
    g.append('text')
        .attr('x', -height / 2) // 중앙 위치
        .attr('y', -margin.left + 15) // 위치 조정
        .attr('transform', 'rotate(-90)') // 90도 회전
        .style('text-anchor', 'middle') // 텍스트 중앙 정렬
        .text('PCA Component 2'); // 텍스트 내용

    // 범례 추가
    const legend = svg.append('g')
        .attr('transform', `translate(${margin.left + width - 100}, ${margin.top})`);

    const uniqueLabels = ["setosa", "versicolor", "virginica"]; // 클래스 레이블
    uniqueLabels.forEach((label, i) => {
        // 원 추가
        legend.append('circle')
            .attr('cx', 9) // x 위치
            .attr('cy', i * 20 + 9) // y 위치 조정
            .attr('r', 9) // 원의 반지름
            .attr('fill', color(label)); // 색상 설정

        // 텍스트 추가
        legend.append('text')
            .attr('x', 25) // x 위치
            .attr('y', i * 20 + 15) // y 위치 조정
            .attr('class', 'legend') // 클래스 이름
            .text(label); // 레이블 텍스트
    });
}

// Flask 서버에서 PCA 데이터 가져오기
fetch('http://127.0.0.1:5000/pca_data')
    .then(response => response.json()) // JSON 형식으로 파싱
    .then(data => {
        console.log(data);  // 데이터 확인
        createPCA(data); // 차트 그리기 함수 호출
    })
    .catch(error => console.error('Error loading or parsing data:', error)); // 에러 처리
