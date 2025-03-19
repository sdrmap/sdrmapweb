<!--navbar-->
<!--desktop mode-->
<div class="navbar desktop" id="navbarDesktop">
	<div class="button" onclick="centeroverlayShow('about')">
		About
	</div>
	<a class="button" href="https://github.com/sdrmap/docs/wiki" target="blank">
		Feed us
	</a>
	<a class="button" href="https://sdrmap.org/impressum.php" target="blank">
		Impressum
	</a>
</div>

<!--mobile mode-->
<div class="navbar mobile" id="navbarMobile">
	<i class="fas fa-bars" onclick="menueToggle()"></i>
	<a href="https://sdrmap.org/impressum.php" target="blank">Impressum</a>
	<i class="fas fa-window-close" id="mobileClose" onclick="menueHide(); sidebarHide();"></i>
</div>
